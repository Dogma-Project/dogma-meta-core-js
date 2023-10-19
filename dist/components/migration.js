"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const state_1 = require("../libs/state");
const store_1 = require("../libs/store");
const logger_1 = __importDefault(require("../libs/logger"));
const constants_1 = require("../constants");
(0, state_1.subscribe)(["protocol-db"], (_action, value) => {
    if (value >= constants_1.STATES.LIMITED)
        return; // don't trigger when status is loaded
    (0, store_1.readProtocolTable)()
        .then((protocol) => {
        logger_1.default.info("migration", "protocol", protocol);
    })
        .catch((err) => {
        (0, state_1.emit)("protocol-db", constants_1.STATES.ERROR); // check
        logger_1.default.log("store", "read nodes db error::", err);
    });
});
(0, state_1.subscribe)(["protocol-DB"], (_action, value) => {
    try {
        if (value < constants_1.PROTOCOL.DB) {
            const migration = require(`./migrations/migration-${value}.js`);
            migration(value)
                .then((_result) => {
                (0, state_1.emit)("protocol-db", constants_1.STATES.RELOAD);
            })
                .catch((err) => {
                logger_1.default.error("MIGRATION", "protocol-DB", 1, err);
            });
        }
        else {
            (0, state_1.emit)("protocol-db", constants_1.STATES.FULL);
        }
    }
    catch (err) {
        logger_1.default.error("MIGRATION", "protocol-DB", 2, err);
    }
});
