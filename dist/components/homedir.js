"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const state_1 = __importDefault(require("./state"));
const checkHomeDir_1 = __importDefault(require("../modules/checkHomeDir"));
const logger_1 = __importDefault(require("../modules/logger"));
state_1.default.subscribe(["START" /* Event.Type.start */], () => {
    (0, checkHomeDir_1.default)()
        .then(() => {
        state_1.default.emit("HOME DIR" /* Event.Type.homeDir */, 7 /* System.States.full */);
    })
        .catch((err) => {
        logger_1.default.error("Home Dir", err);
        state_1.default.emit("HOME DIR" /* Event.Type.homeDir */, 0 /* System.States.error */);
    });
});
