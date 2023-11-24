import fs from "node:fs";
import stateManager from "./state";
import { Event, System, Keys } from "../types";
import storage from "./storage";
import { getDatadir } from "../modules/datadir";
import logger from "../modules/logger";
import { getArg } from "../modules/arguments";
import { createKeyPair } from "../modules/keys";
import { createSha256Hash } from "../modules/hash";

stateManager.subscribe([Event.Type.masterKey], ([payload]) => {
  const dir = getDatadir();
  if (payload === System.States.empty) {
    logger.log("KEYS", "master key", "empty");
    if (getArg(System.Args.auto)) {
      createKeyPair(Keys.Type.masterKey, 4096)
        .then(() => {
          stateManager.emit(Event.Type.masterKey, System.States.ready);
        })
        .catch((err) => {
          stateManager.emit(Event.Type.masterKey, System.States.error);
          logger.error("keys:master", err);
        });
    }
  } else if (payload === System.States.ready) {
    logger.log("KEYS", "master key", "ready");
    try {
      storage.user.privateKey = fs.readFileSync(
        dir.keys + "/master-private.pem"
      );
      storage.user.publicKey = fs.readFileSync(dir.keys + "/master-public.pem");
      stateManager.emit(Event.Type.masterKey, System.States.full);
    } catch (e) {
      logger.log("store", "MASTER KEYS NOT FOUND");
      stateManager.emit(Event.Type.masterKey, System.States.empty);
    }
  } else if (payload === System.States.full) {
    logger.log("KEYS", "master key", "loaded");
    if (storage.user.publicKey) {
      storage.user.id = createSha256Hash(storage.user.publicKey);
      stateManager.emit(Event.Type.storageUser, System.States.full);
    }
  }
});

stateManager.subscribe([Event.Type.nodeKey], ([payload]) => {
  const dir = getDatadir();
  if (payload === System.States.empty) {
    logger.log("KEYS", "node key", "empty");
    if (getArg(System.Args.auto)) {
      createKeyPair(Keys.Type.nodeKey, 2048)
        .then(() => {
          stateManager.emit(Event.Type.nodeKey, System.States.ready);
        })
        .catch((err) => {
          stateManager.emit(Event.Type.nodeKey, System.States.error);
          logger.error("keys:node", err);
        });
    }
  } else if (payload === System.States.ready) {
    logger.log("KEYS", "node key", "ready");
    try {
      storage.node.privateKey = fs.readFileSync(dir.keys + "/node-private.pem");
      storage.node.publicKey = fs.readFileSync(dir.keys + "/node-public.pem");
      stateManager.emit(Event.Type.nodeKey, System.States.full);
    } catch (e) {
      logger.log("store", "NODE KEYS NOT FOUND");
      stateManager.emit(Event.Type.nodeKey, System.States.empty);
    }
  } else if (payload === System.States.full) {
    logger.log("KEYS", "node key", "loaded");
    if (storage.node.publicKey) {
      storage.node.id = createSha256Hash(storage.node.publicKey);
      stateManager.emit(Event.Type.storageNode, System.States.full);
    }
  }
});

stateManager.subscribe(
  [Event.Type.start, Event.Type.homeDir],
  ([start, homeDir]) => {
    if (homeDir === System.States.full) {
      logger.log("KEYS", "starting");
      stateManager.emit(Event.Type.masterKey, System.States.ready);
      stateManager.emit(Event.Type.nodeKey, System.States.ready);
    }
  }
);
