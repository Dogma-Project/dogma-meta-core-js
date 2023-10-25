import fs from "node:fs";
import crypto from "node:crypto";
import stateManager from "./state";
import { Event, System, Keys } from "../types";
import storage from "./storage";
import { keysDir } from "../modules/datadir";
import logger from "../modules/logger";
import args from "../modules/arguments";
import { createKeyPair } from "../modules/keys";

stateManager.subscribe(
  [Event.Type.masterKey],
  (action, payload: System.States) => {
    stateManager.services.masterKey = payload;
    if (payload === System.States.empty) {
      if (args.auto) {
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
      try {
        storage.user.privateKey = fs.readFileSync(
          keysDir + "/master-private.pem"
        );
        storage.user.publicKey = fs.readFileSync(
          keysDir + "/master-public.pem"
        );
        stateManager.emit(Event.Type.masterKey, System.States.full);
      } catch (e) {
        logger.log("store", "MASTER KEYS NOT FOUND");
        stateManager.emit(Event.Type.masterKey, System.States.empty);
      }
    } else if (payload === System.States.full) {
      if (storage.user.publicKey) {
        const hash = crypto.createHash("sha256");
        hash.update(storage.user.publicKey);
        storage.user.id = hash.digest("hex");
      }
    }
  }
);

stateManager.subscribe(
  [Event.Type.nodeKey],
  (action, payload: System.States) => {
    stateManager.services.nodeKey = payload;
    if (payload === System.States.empty) {
      if (args.auto) {
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
      try {
        storage.node.privateKey = fs.readFileSync(
          keysDir + "/node-private.pem"
        );
        storage.node.publicKey = fs.readFileSync(keysDir + "/node-public.pem");
        stateManager.emit(Event.Type.nodeKey, System.States.full);
      } catch (e) {
        logger.log("store", "NODE KEYS NOT FOUND");
        stateManager.emit(Event.Type.nodeKey, System.States.empty);
      }
    } else if (payload === System.States.full) {
      if (storage.node.publicKey) {
        const hash = crypto.createHash("sha256");
        hash.update(storage.node.publicKey);
        storage.node.id = hash.digest("hex");
      }
    }
  }
);

stateManager.subscribe([Event.Type.start], () => {
  stateManager.emit(Event.Type.masterKey, System.States.ready);
  stateManager.emit(Event.Type.nodeKey, System.States.ready);
});
