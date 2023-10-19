import Datastore from "@seald-io/nedb";
import logger from "../libs/logger";
import { emit } from "../libs/state";
import { datadir } from "./datadir";
import { STATES } from "../constants";

const dbDir = datadir + "/db";
logger.log("nedb", "HOMEDIR", dbDir);

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
    await protocol.loadDatabaseAsync();
    logger.debug("nedb", "load database", "protocol");
    protocol.ensureIndex({ fieldName: "name", unique: true }, indexHandler);
    emit("protocol-db", STATES.READY);

    await config.loadDatabaseAsync();
    logger.debug("nedb", "load database", "config");
    config.ensureIndex({ fieldName: "param", unique: true }, indexHandler);
    emit("config-db", STATES.READY);

    await users.loadDatabaseAsync();
    logger.debug("nedb", "load database", "users");
    emit("users-db", STATES.READY);

    await nodes.loadDatabaseAsync();
    logger.debug("nedb", "load database", "nodes");
    emit("nodes-db", STATES.READY);

    await dht.loadDatabaseAsync();
    logger.debug("nedb", "load database", "dht");
    dht.ensureIndex(
      { fieldName: "updatedAt", expireAfterSeconds: 3600 },
      indexHandler
    );
    emit("dht-db", STATES.READY);

    await messages.loadDatabaseAsync();
    logger.debug("nedb", "load database", "messages");
    messages.ensureIndex(
      { fieldName: "createdAt", expireAfterSeconds: 3600 * 24 * 30 },
      indexHandler
    );

    await fileTransfer.loadDatabaseAsync();
    logger.debug("nedb", "load database", "fileTransfer");
    fileTransfer.ensureIndex(
      { fieldName: "createdAt", expireAfterSeconds: 3600 * 24 * 30 },
      indexHandler
    );

    await sync.loadDatabaseAsync();
    logger.debug("nedb", "load database", "sync");
    emit("sync-db", STATES.READY);

    return Promise.resolve(true);
  } catch (err) {
    return Promise.reject(err);
  }
};

export {
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
