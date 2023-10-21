import { emit, subscribe } from "../libs/state-old";
import { readProtocolTable } from "../libs/main";
import logger from "../libs/logger";
import { PROTOCOL, STATES } from "../constants";

subscribe(["protocol-db"], (_action, value) => {
  if (value >= STATES.LIMITED) return; // don't trigger when status is loaded
  readProtocolTable()
    .then((protocol) => {
      logger.info("migration", "protocol", protocol);
    })
    .catch((err) => {
      emit("protocol-db", STATES.ERROR); // check
      logger.log("store", "read nodes db error::", err);
    });
});

subscribe(["protocol-DB"], (_action, value) => {
  try {
    if (value < PROTOCOL.DB) {
      const migration = require(`./migrations/migration-${value}.js`);
      migration(value)
        .then((_result: any) => {
          emit("protocol-db", STATES.RELOAD);
        })
        .catch((err: any) => {
          logger.error("MIGRATION", "protocol-DB", 1, err);
        });
    } else {
      emit("protocol-db", STATES.FULL);
    }
  } catch (err) {
    logger.error("MIGRATION", "protocol-DB", 2, err);
  }
});
