import {
  MX,
  MESSAGES,
  DIRECTION,
  MSG_FORMAT,
  DESCRIPTOR,
} from "../../constants";
import messages from "../messages";
import FilesController from "../controllers/files"; // move to dir
import RequestsController from "../controllers/requests";
import logger from "../logger";
import dht from "../../components/dht";
import ConnectionClass from "../connection";
import { Types } from "../../types";

export default function onData(
  this: ConnectionClass,
  socket: Types.Connection.Socket,
  data: Buffer,
  id: number
) {
  try {
    const descriptorBytes = data.slice(0, DESCRIPTOR.SIZE);
    const descriptor = new TextDecoder().decode(descriptorBytes); // catch
    const decodedData = data.slice(DESCRIPTOR.SIZE);
    const { node_id, user_id } = socket.dogma;
    let request;
    switch (id) {
      // text
      case MX.CONTROL:
        if (!socket.authorized)
          return logger.warn("connection", "unauthorized data", id);
        request = JSON.parse(decodedData.toString());
        RequestsController({ node_id, user_id, request });
        break;
      case MX.MESSAGES:
        if (!socket.authorized)
          return logger.warn("connection", "unauthorized data", id);
        try {
          const { text, files, type } = JSON.parse(decodedData.toString());
          const filesData = files.map((file) => {
            const { name, size, type, descriptor } = file;
            return { name, size, type, descriptor };
          });
          messages.commit({
            id: type === MESSAGES.DIRECT ? node_id : user_id,
            text,
            files: filesData,
            direction: DIRECTION.INCOMING,
            format: MSG_FORMAT.COMMON,
            type,
          });
        } catch (err) {
          logger.error("connection", "onData", "messages", err);
        }
        break;
      case MX.FILES:
        if (!socket.authorized)
          return logger.warn("connection", "unauthorized data", id);
        FilesController.handleFile({
          descriptor,
          decodedData,
          node_id,
          user_id,
        });
        break;
      case MX.DHT:
        request = JSON.parse(decodedData.toString());
        const public_ipv4 = socket.remoteAddress;
        const params = {
          request,
          from: {
            user_id,
            node_id,
            public_ipv4,
          },
        };
        dht.handleRequest(params, socket);
        break;
      default:
        if (!socket.authorized)
          return logger.warn("connection", "unauthorized data", id);
        logger.warn("connection", "Unknown substream type", id);
        break;
    }
  } catch (err) {
    logger.error("connection", "onData", err);
  }
}
