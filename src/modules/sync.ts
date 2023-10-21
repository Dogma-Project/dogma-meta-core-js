import logger from "./logger";
import { subscribe } from "./state-old";
import { Message, User, Node, Connection } from "./model";
import { store } from "./main";
import { MESSAGES } from "../constants";
import { Types } from "../types";

const sync = {
  handled: {
    messages: Message,
    users: User,
    nodes: Node,
  },

  state: [],

  /**
   *
   * @param {String} node_id
   * @param {String} type table name
   */
  async get(node_id: Types.Node.Id, type: string) {
    try {
      const model = sync.handled[type];
      // logger.debug("sync", "get", type);
      if (model) {
        const result = await model.getSync(node_id);
        // logger.debug("sync", "send result", result);
        sync.request({
          node_id,
          action: "update",
          data: {
            type,
            payload: result,
          },
        });
      } else {
        logger.warn("sync", "unhandled type", type);
      }
    } catch (err) {
      logger.error("sync", "get", err);
    }
  },

  async update(node_id: Types.Node.Id, type: string, payload: object) {
    try {
      // logger.debug("sync", "update", type, payload);
      const model = sync.handled[type];
      if (model && payload.length) {
        await model.sync(payload, node_id);
      }
    } catch (err) {
      logger.error("sync", "update", err);
    }
  },

  /**
   *
   * @param {Object} params
   * @param {Object} params.node_id node hash
   * @param {String} params.action get, update
   * @param {Object} params.data optional
   */
  request({ node_id, action, data }) {
    const connection = require("./connection"); // temp
    connection.sendRequest(
      node_id,
      {
        type: "sync",
        action,
        data: data || {},
      },
      MESSAGES.DIRECT
    );
  },

  /**
   *
   * @param {Object} params
   * @param {String} params.node_id
   * @param {String} params.user_id
   * @param {Object} params.request
   * @param {String} params.request.action get, update
   * @param {Object} params.request.data
   * @param {String} params.request.data.type table name
   * @param {Array} params.request.data.payload
   */
  handleRequest({ node_id, user_id, request }) {
    if (store.user.id !== user_id)
      return logger.warn("sync", "handle request", "request from not own user");
    try {
      const {
        action,
        data: { type, payload },
      } = request;
      switch (action) {
        case "get":
          sync.get(node_id, type);
          break;
        case "update":
          sync.update(node_id, type, payload);
          break;
      }
    } catch (err) {
      logger.error("sync", err);
    }
  },
};

// subscribe(["sync-db"], async (action, value, type) => {
//     if (value < STATES.LIMITED) {
//         const result = await Sync.getAll();
//         sync.state = result;
//         emit("sync-db", STATES.LIMITED);
//     } else if (value === STATES.LIMITED) {

//     } else if (value === STATES.FULL) {

//     }
// });

subscribe(["online"], (_action, value, _type) => {
  const { node_id, own, mySelf } = value;
  if (own && !mySelf) {
    for (const key in sync.handled) {
      sync.request({
        node_id,
        action: "get",
        data: {
          type: key,
        },
      });
    }
  }
});

subscribe(["nodes", "users"], async (_action, _value, type) => {
  // logger.debug("sync", "resync", action, type);
  const nodes = await Connection.getUserOnlineNodes(store.user.id);
  nodes.forEach((node_id) => {
    if (node_id === store.node.id) return; // don't send to yourself
    sync.get(node_id, type);
  });
});

subscribe(["new-message"], async (_action, value, _type) => {
  try {
    // logger.debug("sync", "resync", action, type);
    const nodes = await Connection.getUserOnlineNodes(store.user.id);
    nodes.forEach((node_id) => {
      if (node_id === store.node.id) return; // don't send to yourself
      sync.request({
        node_id,
        action: "update",
        data: {
          type: "messages",
          payload: [value],
        },
      });
    });
  } catch (err) {
    logger.error("sync", "broadcastUpdate", err);
  }
});

export default sync;
