import fs from "node:fs";
import fsAsync from "node:fs/promises";
import logger = require("../../libs/logger");
import { File } from "../../libs/model";
import EventEmitter from "../../components/eventEmitter";
import { datadir } from "../../components/datadir";
import { DIRECTION, MESSAGES } from "../../constants";
import generateSyncId from "../../libs/generateSyncId";
import { Types } from "../../types";

/** @module FilesController */

const files = {
  sendChunksize: 100000,
  write: {},
  downloadProgress: {},
  uploadProgress: {},

  /**
   *
   * @param {Object} params
   * @param {String} params.to
   * @param {Number} params.type
   * @param {Number} params.descriptor check
   * @param {String} params.title
   * @param {Number} params.size check
   */
  permitFileDownload({ to, type, descriptor, title, size }) {
    return new Promise((resolve, reject) => {
      try {
        const destination = datadir + "/download/" + title;
        const stream = fs.createWriteStream(destination); // add stream closing
        const object = {
          stream,
          title,
          size,
          downloaded: 0,
          to,
          type,
        };
        files.write[descriptor] = object;
        stream.on("open", (_fd) => {
          resolve(true);
        }); // edit
        stream.on("close", () => {
          logger.info("files.js", "write stream for", descriptor, "closed");
        });
        stream.on("finish", () =>
          logger.info("files.js", "writable stream finished", descriptor)
        );
        // resolve(true);
      } catch (err) {
        reject(err);
      }
    });
  },

  async permitFileTransfer(
    user_id: Types.User.Id,
    file: Types.File.Description
  ) {
    try {
      const { name, size, type, pathname, data } = file;
      const descriptor = this.getFileDescriptor();
      if (!!pathname && !data) {
        file.descriptor = descriptor;
        await File.permitFileTransfer({ user_id, file });
        return { descriptor, pathname };
      } else if (!pathname && !!data) {
        const regex = /^data:.+\/(.+);base64,(.*)$/;
        const matches = data.match(regex);
        const destination = datadir + "/temp/" + name;
        const fileData = Buffer.from(matches[2], "base64");
        await fsAsync.writeFile(destination, fileData);
        const tmpFile = {
          descriptor,
          size,
          pathname: destination,
        };
        await File.permitFileTransfer({ user_id, file: tmpFile });
        return { descriptor, pathname: destination };
      } else {
        return Promise.reject("undefined data and pathname");
      }
    } catch (err) {
      return Promise.reject(err);
    }
  },

  forbidFileUpload(descriptor: number) {},

  async sendFile(
    user_id: Types.User.Id,
    node_id: Types.Node.Id,
    descriptor: number
  ) {
    try {
      const value = await File.fileTransferAllowed({ user_id, descriptor });
      if (!value)
        return logger.warn("files.js", "sendFile", "not allowed for", user_id);
      const connection = require("../connection"); // edit
      const channel = await connection.streamToNode({ node_id, descriptor }); // edit
      let size, stream;
      let uploaded = 0;

      const fileInfo = fs.statSync(value.pathname);
      size = fileInfo.size;

      stream = fs.createReadStream(value.pathname, {
        highWaterMark: files.sendChunksize,
      });
      stream.on("close", () => {
        logger.info("files.js", "readable stream closed", descriptor);
      });
      stream.on("end", () => {
        logger.info("files.js", "readable stream ended", descriptor);
      });
      stream.on("data", (data) => {
        uploaded += data.length;
        const progress = uploaded / size;
        channel.write(data);
        if (progress === 1) channel.end();

        const progressValue = progress.toFixed(2);
        if (files.uploadProgress[descriptor] === progressValue) return;
        files.uploadProgress[descriptor] = progressValue;

        EventEmitter.emit("file-transfer", {
          progress: progressValue,
          direction: DIRECTION.OUTCOMING,
          descriptor,
          user_id,
          node_id,
        });
      });
    } catch (err) {
      logger.error("files.js", "sendFile", err);
    }
  },

  /**
   *
   * @param {Object} params
   * @param {String} params.node_id
   * @param {String} params.user_id
   * @param {Object} params.request
   * @param {String} params.request.type
   * @param {String} params.request.action
   * @param {Object} params.request.data
   */
  handleRequest(
    user_id: Types.User.Id,
    node_id: Types.Node.Id,
    request: object
  ) {
    const {
      data: { descriptor },
    } = request;
    if (!descriptor) return logger.warn("files.js", "unknown file descriptor");
    switch (request.action) {
      case "download":
        files.sendFile({ node_id, user_id, descriptor });
        break;
    }
  },

  /**
   *
   * @param {Object} params
   * @param {Number} params.descriptor
   * @param {Buffer} params.decodedData check
   * @param {String} params.node_id
   * @param {String} params.user_id
   */
  handleFile({ descriptor, decodedData, node_id, user_id }) {
    // add file opening for write + control size and checksum
    if (!files.write[descriptor])
      return logger.warn("files.js", "this file didn't expected");
    let object = files.write[descriptor];
    const { to, type } = object;
    switch (type) {
      case MESSAGES.DIRECT:
        if (to !== node_id)
          return logger.warn("files.js", node_id, "not allowed");
        break;
      case MESSAGES.USER:
        if (to !== user_id)
          return logger.warn("files.js", user_id, "not allowed");
        break;
      default:
        return logger.warn("files.js", "CHAT TRANSFER", "not allowed");
        break;
    }
    object.downloaded += decodedData.length;
    if (object.downloaded > object.size) {
      object.stream && object.stream.end();
      return logger.warn("files.js", "can't write more than expected");
    }
    object.stream.write(decodedData);
    const progress = object.downloaded / object.size;
    if (progress === 1) object.stream.end();

    const progressValue = progress.toFixed(2);
    if (files.downloadProgress[descriptor] === progressValue) return;
    files.downloadProgress[descriptor] = progressValue;

    EventEmitter.emit("file-transfer", {
      progress: progressValue,
      direction: DIRECTION.INCOMING,
      descriptor,
      user_id,
      node_id,
    });
  },

  /**
   *
   * @returns {String} descriptor size:15
   */
  getFileDescriptor() {
    return generateSyncId(5);
  },
};

export default files;
