import worker from "node:worker_threads";
import fs from "node:fs/promises";
import stateManager from "./state";
import storage from "./storage";
import dataDir from "../modules/datadir";
import logger from "../modules/logger";
import { createKeyPair, readOrCreateEncryptionKey } from "../modules/keys";
import { createSha256Hash } from "../modules/hash";
import { C_Event, C_System, C_Keys } from "../constants";

stateManager.subscribe([C_Event.Type.userKey], async ([payload]) => {
  if (payload === C_System.States.empty) {
    logger.info("store", "Master key not found");
    if (worker.workerData.auto) {
      createKeyPair(C_Keys.Type.userKey, 4096)
        .then(() => {
          stateManager.emit(C_Event.Type.userKey, C_System.States.ready);
        })
        .catch((err) => {
          stateManager.emit(C_Event.Type.userKey, C_System.States.error);
          logger.error("keys:master", err);
        });
    }
  } else if (payload === C_System.States.ready) {
    logger.log("KEYS", "Reading master key");
    try {
      storage.user.privateKey = await fs.readFile(
        dataDir.keys + "/master-private.pem"
      );
      storage.user.publicKey = await fs.readFile(
        dataDir.keys + "/master-public.pem"
      );
      stateManager.emit(C_Event.Type.userKey, C_System.States.full);
    } catch (e) {
      // edit
      stateManager.emit(C_Event.Type.userKey, C_System.States.empty);
    }
  } else if (payload === C_System.States.full) {
    logger.info("KEYS", "master key", "loaded");
    if (storage.user.publicKey) {
      storage.user.id = createSha256Hash(storage.user.publicKey);
      stateManager.emit(C_Event.Type.storageUser, C_System.States.full);
    }
    logger.log("KEYS", "Loading encryption key.");
    readOrCreateEncryptionKey(storage.user.publicKey!, storage.user.privateKey!)
      .then((res) => {
        logger.log("ENCRYPTION KEY", "loaded");
        stateManager.emit(C_Event.Type.encryptionKey, res);
      })
      .catch((err) => {
        logger.error("ENCRYPTION KEY", "NOT LOADED", err);
      });
  }
});

stateManager.subscribe([C_Event.Type.nodeKey], async ([payload]) => {
  if (payload === C_System.States.empty) {
    logger.info("KEYS", "Node key not found");
    if (worker.workerData.auto) {
      createKeyPair(C_Keys.Type.nodeKey, 2048)
        .then(() => {
          stateManager.emit(C_Event.Type.nodeKey, C_System.States.ready);
        })
        .catch((err) => {
          stateManager.emit(C_Event.Type.nodeKey, C_System.States.error);
          logger.error("keys:node", err);
        });
    }
  } else if (payload === C_System.States.ready) {
    logger.log("KEYS", "Reading node key");
    try {
      storage.node.privateKey = await fs.readFile(
        dataDir.keys + "/node-private.pem"
      );
      storage.node.publicKey = await fs.readFile(
        dataDir.keys + "/node-public.pem"
      );
      stateManager.emit(C_Event.Type.nodeKey, C_System.States.full);
    } catch (e) {
      // edit
      stateManager.emit(C_Event.Type.nodeKey, C_System.States.empty);
    }
  } else if (payload === C_System.States.full) {
    logger.info("KEYS", "node key", "loaded");
    if (storage.node.publicKey) {
      storage.node.id = createSha256Hash(storage.node.publicKey);
      stateManager.emit(C_Event.Type.storageNode, C_System.States.full);
    }
  }
});

stateManager.subscribe(
  [C_Event.Type.start, C_Event.Type.dirStatus],
  ([start, homeDir]) => {
    if (homeDir === C_System.States.full) {
      logger.log("KEYS", "Start loading keys.");
      stateManager.emit(C_Event.Type.userKey, C_System.States.ready);
      stateManager.emit(C_Event.Type.nodeKey, C_System.States.ready);
    }
  }
);
