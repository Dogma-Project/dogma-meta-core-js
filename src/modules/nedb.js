import Datastore from "@seald-io/nedb";
const { emit } = require("./state");
const logger = require("../logger");
const { datadir } = require("./datadir");
const { STATES } = require("./constants");

const dbDir = datadir + "/db";
logger.log("nedb", "HOMEDIR", dbDir);

const stores = {};

const indexHandler = (err) => {
  if (err) logger.error("nedb", "indexHandler error::", err);
};

stores.connections = new Datastore({
  autoload: true,
});
stores.connections.ensureIndex(
  {
    fieldName: "node_id",
    unique: true,
  },
  indexHandler
);
stores.connections.ensureIndex(
  {
    fieldName: "address",
    unique: true,
  },
  indexHandler
);

// ------------------------ PERSIST -------------------------

stores.config = new Datastore({
  filename: dbDir + "/config.db",
});
stores.users = new Datastore({
  // sync
  filename: dbDir + "/users.db",
  timestampData: true,
});
stores.nodes = new Datastore({
  // sync
  filename: dbDir + "/nodes.db",
  timestampData: true,
});
stores.messages = new Datastore({
  // sync
  filename: dbDir + "/messages.db",
  timestampData: true,
});
stores.fileTransfer = new Datastore({
  filename: dbDir + "/transfer.db",
  timestampData: true,
});
stores.sync = new Datastore({
  filename: dbDir + "/sync.db",
});
stores.dht = new Datastore({
  filename: dbDir + "/dht.db",
  timestampData: true,
});
stores.protocol = new Datastore({
  filename: dbDir + "/protocol.db",
});

/**
 * @returns {Promise}
 */
stores.initPersistDbs = async () => {
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

module.exports = stores;
