"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const state_1 = __importDefault(require("./state"));
const main_1 = require("../modules/main");
const logger_1 = __importDefault(require("../modules/logger"));
const constants_1 = require("../constants");
state_1.default.subscribe(["protocol-db"], (_action, value) => {
    if (value >= STATES.LIMITED)
        return; // don't trigger when status is loaded
    (0, main_1.readProtocolTable)()
        .then((protocol) => {
        logger_1.default.info("migration", "protocol", protocol);
    })
        .catch((err) => {
        emit("protocol-db", STATES.ERROR); // check
        logger_1.default.log("store", "read nodes db error::", err);
    });
});
state_1.default.subscribe(["protocol-DB"], (_action, value) => {
    try {
        if (value < constants_1.PROTOCOL.DB) {
            const migration = require(`./migrations/migration-${value}.js`);
            migration(value)
                .then((_result) => {
                emit("protocol-db", STATES.RELOAD);
            })
                .catch((err) => {
                logger_1.default.error("MIGRATION", "protocol-DB", 1, err);
            });
        }
        else {
            emit("protocol-db", STATES.FULL);
        }
    }
    catch (err) {
        logger_1.default.error("MIGRATION", "protocol-DB", 2, err);
    }
});
