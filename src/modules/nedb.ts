import Datastore from "@seald-io/nedb";
import logger from "../logger";
import { emit } from "./state";
import { datadir } from "./datadir";
import { STATES } from "./constants";

const dbDir = datadir + "/db";
logger.log("nedb", "HOMEDIR", dbDir);

interface NedbStores {
  connections: Datastore;
  config: Datastore;
  users: Datastore;
  nodes: Datastore;
  messages: Datastore;
  fileTransfer: Datastore;
  sync: Datastore;
  dht: Datastore;
  protocol: Datastore;
  initPersistDbs(): Promise<boolean>;
}

const indexHandler = (err: any) => {
  if (err) logger.error("nedb", "indexHandler error::", err);
};

const connections = new Datastore({
  autoload: true,
});
connections.ensureIndex(
  {
    fieldName: "node_id",
    unique: true,
  },
  indexHandler
);
connections.ensureIndex(
  {
    fieldName: "address",
    unique: true,
  },
  indexHandler
);

// ------------------------ PERSIST -------------------------

const config = new Datastore({
  filename: dbDir + "/config.db",
});
const users = new Datastore({
  // sync
  filename: dbDir + "/users.db",
  timestampData: true,
});
const nodes = new Datastore({
  // sync
  filename: dbDir + "/nodes.db",
  timestampData: true,
});
const messages = new Datastore({
  // sync
  filename: dbDir + "/messages.db",
  timestampData: true,
});
const fileTransfer = new Datastore({
  filename: dbDir + "/transfer.db",
  timestampData: true,
});
const sync = new Datastore({
  filename: dbDir + "/sync.db",
});
const dht = new Datastore({
  filename: dbDir + "/dht.db",
  timestampData: true,
});
const protocol = new Datastore({
  filename: dbDir + "/protocol.db",
});

/**
 * @returns {Promise}
 */
const initPersistDbs = async () => {
  logger.log("nedb", "load databases...");
  try {
    await stores.protocol.loadDatabaseAsync();
    logger.debug("nedb", "load database", "protocol");
    stores.protocol.ensureIndex(
      { fieldName: "name", unique: true },
      indexHandler
    );
    emit("protocol-db", STATES.READY);

    await stores.config.loadDatabaseAsync();
    logger.debug("nedb", "load database", "config");
    stores.config.ensureIndex(
      { fieldName: "param", unique: true },
      indexHandler
    );
    emit("config-db", STATES.READY);

    await stores.users.loadDatabaseAsync();
    logger.debug("nedb", "load database", "users");
    emit("users-db", STATES.READY);

    await stores.nodes.loadDatabaseAsync();
    logger.debug("nedb", "load database", "nodes");
    emit("nodes-db", STATES.READY);

    await stores.dht.loadDatabaseAsync();
    logger.debug("nedb", "load database", "dht");
    stores.dht.ensureIndex(
      { fieldName: "updatedAt", expireAfterSeconds: 3600 },
      indexHandler
    );
    emit("dht-db", STATES.READY);

    await stores.messages.loadDatabaseAsync();
    logger.debug("nedb", "load database", "messages");
    stores.messages.ensureIndex(
      { fieldName: "createdAt", expireAfterSeconds: 3600 * 24 * 30 },
      indexHandler
    );

    await stores.fileTransfer.loadDatabaseAsync();
    logger.debug("nedb", "load database", "fileTransfer");
    stores.fileTransfer.ensureIndex(
      { fieldName: "createdAt", expireAfterSeconds: 3600 * 24 * 30 },
      indexHandler
    );

    await stores.sync.loadDatabaseAsync();
    logger.debug("nedb", "load database", "sync");
    emit("sync-db", STATES.READY);

    return Promise.resolve(true);
  } catch (err) {
    return Promise.reject(err);
  }
};

const stores: NedbStores = {
  connections,
  config,
  users,
  nodes,
  messages,
  fileTransfer,
  sync,
  dht,
  protocol,
  initPersistDbs,
};

module.exports = stores;
export default stores;
