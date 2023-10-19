import Datastore from "@seald-io/nedb";
declare const connections: Datastore<Record<string, any>>;
declare const config: Datastore<Record<string, any>>;
declare const users: Datastore<Record<string, any>>;
declare const nodes: Datastore<Record<string, any>>;
declare const messages: Datastore<Record<string, any>>;
declare const fileTransfer: Datastore<Record<string, any>>;
declare const sync: Datastore<Record<string, any>>;
declare const dht: Datastore<Record<string, any>>;
declare const protocol: Datastore<Record<string, any>>;
/**
 * @returns {Promise}
 */
declare const initPersistDbs: () => Promise<boolean>;
export { connections, config, users, nodes, messages, fileTransfer, sync, dht, protocol, initPersistDbs, };
