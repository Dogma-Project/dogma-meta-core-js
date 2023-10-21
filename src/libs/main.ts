import { initPersistDbs } from "../components/nedb"; // edit // reorder
import fs from "node:fs"; // edit
import { emit, subscribe, services, state } from "./state";
import logger from "./logger";
import { datadir, dogmaDir } from "../components/datadir";
import args from "../components/arguments";
import { DEFAULTS, PROTOCOL } from "../constants";

import {
  createConfigTable as cconfig,
  createUsersTable as cusers,
  createNodesTable as cnodes,
} from "./createDataBase";
import { Config, User, Node, Protocol } from "./model";
import { Types } from "../types";

const keysDir = datadir + "/keys";

/** @module Store */

/**
 *
 * @returns {Promise}
 */
export const readConfigTable = async () => {
  try {
    const data = await Config.getAll();
    if (!data.length) return Promise.reject(0);
    data.forEach((element) => {
      store.config[element.param] = element.value;
      emit("config-" + element.param, element.value);
    });
    return data;
  } catch (err) {
    return Promise.reject(err);
  }
};

/**
 *
 * @returns {Promise}
 */
export const readUsersTable = async () => {
  try {
    const data = await User.getAll();
    if (!data.length) return Promise.reject(0);
    let caArray = [];
    data.forEach((user) => caArray.push(Buffer.from(user.cert))); // check exception
    store.ca = caArray;
    store.users = data;
    emit("users", data);
    return data;
  } catch (err) {
    return Promise.reject(err);
  }
};

/**
 *
 * @returns {Promise}
 */
export const readNodesTable = async () => {
  try {
    const data = await Node.getAll();
    if (!data.length) return Promise.reject(0);
    store.nodes = data;
    // const currentNode = store.nodes.find(node => node.node_id === store.node.id);
    // if (currentNode) {
    // 	store.node.public_ipv4 = currentNode.public_ipv4;
    // } else {
    // 	logger.warn("store", "OWN NODE NOT FOUND", store.node);
    // }
    emit("nodes", store.nodes);
    return data;
  } catch (err) {
    return Promise.reject(err);
  }
};

/**
 * @returns {Promise}
 */
export const readProtocolTable = async () => {
  try {
    const data = await Protocol.getAll();
    let protocol = {};
    for (const key in PROTOCOL) {
      const item = data.find((obj) => obj.name === key);
      const value = !!item ? item.value || 0 : 0;
      protocol[key] = value;
      emit("protocol-" + key, value);
    }
    return protocol;
  } catch (err) {
    return Promise.reject(err);
  }
};

/**
 *
 * @returns {Promise}
 */
export const checkHomeDir = () => {
  // check and test
  return new Promise((resolve, reject) => {
    try {
      const dirs = ["keys", "db", "download", "temp"];
      if (!args.prefix && !fs.existsSync(datadir))
        fs.mkdirSync(datadir, { recursive: true });
      dirs.forEach((dir) => {
        const oldDir = dogmaDir + "/" + dir;
        const newDir = datadir + "/" + dir;
        if (!args.prefix && fs.existsSync(oldDir)) {
          // if prefix not exist and there's a dirs in a root
          fs.renameSync(oldDir, newDir);
        } else if (!fs.existsSync(newDir)) {
          // if there's no data dir in prefixed space
          fs.mkdirSync(newDir, { recursive: true });
        }
      });
      resolve(true);
    } catch (err) {
      reject(err);
    }
  });
};

const defaults = {
  router: DEFAULTS.ROUTER,
  bootstrap: DHTPERM.ONLY_FRIENDS,
  dhtLookup: DHTPERM.ONLY_FRIENDS,
  dhtAnnounce: DHTPERM.ONLY_FRIENDS,
  external: DEFAULTS.EXTERNAL,
  autoDefine: DEFAULTS.AUTO_DEFINE_IP,
  public_ipv4: "",
};

subscribe(
  ["master-key", "node-key", "config-db", "protocol-db"],
  (_action, _value, _type) => {
    if (state["config-db"] >= STATES.LIMITED) return; // don't trigger when status is loaded
    if (state["protocol-db"] < STATES.FULL) return;
    readConfigTable()
      .then((_result) => {
        emit("config-db", STATES.FULL);
      })
      .catch((err) => {
        if (args.auto) {
          logger.info("STORE", "Creating config table in automatic mode");
          cconfig(defaults);
        } else {
          emit("config-db", STATES.ERROR); // check
          logger.log("store", "read config db error::", err);
        }
      });
  }
);
subscribe(
  ["master-key", "node-key", "users-db", "protocol-db"],
  (action, value, type) => {
    // check
    if (state["users-db"] >= STATES.LIMITED) return; // don't trigger when status is loaded
    if (state["protocol-db"] < STATES.FULL) return;
    readUsersTable()
      .then((_result) => {
        emit("users-db", STATES.FULL);
      })
      .catch((err) => {
        if (args.auto) {
          logger.info("STORE", "Creating users table in automatic mode");
          cusers(store);
        } else {
          emit("users-db", STATES.ERROR); // check
          logger.log("store", "read users db error::", err);
        }
      });
  }
);
subscribe(
  ["master-key", "node-key", "nodes-db", "protocol-db"],
  (_action, status) => {
    if (state["nodes-db"] >= STATES.LIMITED) return; // don't trigger when status is loaded
    if (state["protocol-db"] < STATES.FULL) return;
    readNodesTable()
      .then((result) => {
        emit("nodes-db", STATES.FULL);
      })
      .catch((err) => {
        if (args.auto) {
          logger.info("STORE", "Creating nodes table in automatic mode");
          cnodes(store, defaults);
        } else {
          emit("nodes-db", STATES.ERROR); // check
          logger.log("store", "read nodes db error::", err);
        }
      });
  }
);

subscribe(["config-db", "users-db", "nodes-db"], () => {
  const arr = [state["config-db"], state["users-db"], state["nodes-db"]];
  arr.sort((a, b) => {
    return a > b;
  });
  services.database = arr[0]; // min value
});

// INIT POINT
const init = async () => {
  try {
    await checkHomeDir();
    await initPersistDbs();
    getKeys();
  } catch (err) {
    logger.error("store.js", "init", err);
  }
};

init();
