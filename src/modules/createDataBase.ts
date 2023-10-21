import { Config, User, Node, Protocol } from "./model";
import { PROTOCOL } from "../constants";
import { Types } from "../types";

/** @module CreateDataBase */

export const createConfigTable = (defaults: Types.Config.Params) => {
  return Protocol.persistProtocol(PROTOCOL).then(() => {
    Config.persistConfig(defaults);
  }); // check
};

export const createUsersTable = (store: Types.Store) => {
  const { id: user_id, name } = store.user;
  const query = {
    user_id,
    name,
  };
  return User.persistUser(query);
};

export const createNodesTable = (
  store: Types.Store,
  defaults: Types.Config.Params
) => {
  const query = {
    name: store.node.name,
    node_id: store.node.id,
    user_id: store.user.id,
    public_ipv4: defaults.public_ipv4,
    router_port: defaults.router,
  };
  return Node.persistNodes([query]);
};

export const createDataBase = (
  store: Types.Store,
  defaults: Types.Config.Params
) => {
  return new Promise(async (resolve, reject) => {
    try {
      await createConfigTable(defaults);
      await createUsersTable(store);
      await createNodesTable(store, defaults);
      resolve(1);
    } catch (err) {
      reject(err);
    }
  });
};
