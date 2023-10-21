import { Types } from "../../types";
import Datastore from "@seald-io/nedb";
import logger from "../logger";

import {
  nodes as nodesDb,
  users as usersDb,
  connections as connectionsDb,
} from "../../components/nedb";

/** IN MEMORY */

const model = {
  connectionsDb: new Datastore({
    autoload: true,
  }),

  async init() {
    try {
      logger.debug("nedb", "load database", "connections");
      connectionsDb.ensureIndexAsync({
        fieldName: "node_id",
        unique: true,
      });
      connectionsDb.ensureIndexAsync({
        fieldName: "address",
        unique: true,
      });
    } catch (err) {
      logger.error("config.nedb", err);
    }
  },

  async push(params: Types.Connection.Description) {
    return connectionsDb.insertAsync(params);
  },

  async delete(connection_id: Types.Connection.Id) {
    return connectionsDb.removeAsync({ connection_id }, { multi: true });
  },

  /**
   * @todo add exceptions for non-loaded data
   * @returns {Promise}
   */
  getConnections() {
    return new Promise(async (resolve, reject) => {
      try {
        const online = await connectionsDb.findAsync({});
        const nodesQuery = [];
        const usersQuery = [];
        online.forEach((row) => {
          const { node_id, user_id } = row;
          nodesQuery.push(node_id);
          usersQuery.push(user_id);
        });
        const nodes = await nodesDb.findAsync({
          node_id: { $in: nodesQuery.unique() },
        });
        const users = await usersDb.findAsync({
          user_id: { $in: usersQuery.unique() },
        });
        const arr = [];
        online.forEach((connection) => {
          const { node_id, user_id, authorized } = connection;
          const nodeData = nodes.find((item) => item.node_id === node_id);
          const userData = users.find((item) => item.user_id === user_id);
          arr.push({
            id: connection.connection_id,
            address: connection.address,
            user: {
              user_id,
              name: userData ? userData.name : user_id,
            },
            node: {
              node_id,
              name: nodeData ? nodeData.name : node_id,
            },
            authorized,
          });
        });
        resolve(arr);
      } catch (err) {
        reject(err);
      }
    });
  },

  /**
   * @todo delete
   */
  async isNodeOnline(node_id: Types.Node.Id) {
    try {
      const result = await connectionsDb.findOneAsync({ node_id });
      return result && result.connection_id;
    } catch (err) {
      return Promise.reject(err);
    }
  },

  async getConnectionsCount(address: string, node_id: Types.Node.Id) {
    try {
      const result = await connectionsDb.findAsync({
        $or: [{ address }, { node_id }],
      });
      return result.length;
    } catch (err) {
      return Promise.reject(err);
    }
  },

  async getConnDataByNodeId(node_id: Types.Node.Id) {
    return connectionsDb.findOneAsync({ node_id });
  },

  async getConnDataByUserId(user_id: Types.User.Id) {
    return connectionsDb.findAsync({ user_id });
  },

  async getUserOnlineNodes(user_id: Types.User.Id) {
    try {
      const result = await connectionsDb
        .findAsync({ user_id })
        .projection({ node_id: 1, _id: 0 });
      return result.map((item) => item.node_id);
    } catch (err) {
      return Promise.reject(err);
    }
  },
};

export default model;
