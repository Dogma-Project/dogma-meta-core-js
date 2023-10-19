import { store } from "./store";
import { emit } from "./state";
import logger from "./logger";
import { Node } from "./model";
import { test } from "./client";
import { STATES } from "../constants";

/** @module ConnectionTester */

const getExternalIp4 = () => {
  return new Promise((resolve, reject) => {
    try {
      var extServices = store.config.external.split("\n").map((item) => {
        return item.trim();
      });
      var extIP = require("ext-ip")({
        mode: "parallel",
        replace: true,
        timeout: 500,
        userAgent: "curl/ext-ip-getter",
        followRedirect: true,
        maxRedirects: 10,
        services: extServices,
      });
    } catch (err) {
      return reject(err);
    }
    extIP
      .get()
      .then(resolve)
      .catch((error) => {
        if (store.node.public_ipv4 && store.node.public_ipv4 !== "127.0.0.1") {
          resolve(store.node.public_ipv4);
        } else {
          logger.error("connection tester", error);
          reject("can't get public ip");
        }
      });
  });
};

/**
 *
 * @param {String} ip
 * @returns {Promise}
 * @todo add config update
 */
const testExternalIp4 = async (ip) => {
  try {
    if (store.node.public_ipv4 === ip) {
      return true;
    } else {
      const result = await Node.setNodePublicIPv4(store.node.id, ip);
      logger.log("connection tester", "external public_ipv4 saved", result);
      store.node.public_ipv4 = ip;
      return true;
    }
  } catch (err) {
    return Promise.reject(err);
  }
};

/**
 *
 */
const testExternalPort = () => {
  const peer = {
    host: store.node.public_ipv4,
    port: store.config.router,
  };
  test(peer, (result) => {
    if (result) {
      emit("server", STATES.FULL);
    } else {
      emit("server", STATES.LIMITED);
      logger.log("connection tester", "router external port is closed");
    }
  });
};

const check = () => {
  if (store.config.autoDefine) {
    getExternalIp4()
      .then(testExternalIp4)
      .then(testExternalPort)
      .catch((error) => {
        logger.error("connection tester", error);
      });
  } else {
    if (!!store.config.public_ipv4) {
      testExternalIp4(store.config.public_ipv4)
        .then(testExternalPort)
        .catch((error) => {
          logger.error("connection tester", error);
        });
    } else {
      logger.warn("connection tester", "undefined public_ipv4");
    }
  }
};

export default check;
