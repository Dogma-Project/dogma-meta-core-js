"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configModel = exports.userModel = exports.nodeModel = exports.dhtModel = void 0;
const state_1 = __importDefault(require("./state"));
const state_2 = __importDefault(require("./state"));
const model_1 = require("../modules/model");
const logger_1 = __importDefault(require("../modules/logger"));
const configModel = new model_1.ConfigModel({ state: state_1.default });
exports.configModel = configModel;
const nodeModel = new model_1.NodeModel({ state: state_1.default });
exports.nodeModel = nodeModel;
const dhtModel = new model_1.DHTModel({ state: state_1.default });
exports.dhtModel = dhtModel;
const userModel = new model_1.UserModel({ state: state_1.default });
exports.userModel = userModel;
state_2.default.subscribe(["START" /* Event.Type.start */, "HOME DIR" /* Event.Type.homeDir */], () => {
    configModel.init();
    nodeModel.init();
    dhtModel.init();
    userModel.init();
});
state_2.default.subscribe(["CONFIG DB" /* Event.Type.configDb */], (value) => {
    switch (value) {
        case 2 /* System.States.ready */:
        case 4 /* System.States.reload */:
            configModel.loadConfigTable();
            break;
        case 3 /* System.States.empty */:
            logger_1.default.log("CONFIG MODEL", "is empty");
            break;
        case 5 /* System.States.limited */:
        case 6 /* System.States.ok */:
        case 7 /* System.States.full */:
            // ok
            break;
        default:
            // not ok
            break;
    }
});
state_2.default.subscribe(["USERS DB" /* Event.Type.usersDb */], (value) => {
    switch (value) {
        case 2 /* System.States.ready */:
        case 4 /* System.States.reload */:
            userModel.loadUsersTable();
            break;
        case 3 /* System.States.empty */:
            logger_1.default.log("USER MODEL", "is empty");
            break;
        case 5 /* System.States.limited */:
        case 6 /* System.States.ok */:
        case 7 /* System.States.full */:
            // ok
            break;
        default:
            // not ok
            break;
    }
});
state_2.default.subscribe(["NODES DB" /* Event.Type.nodesDb */], (value) => {
    switch (value) {
        case 2 /* System.States.ready */:
        case 4 /* System.States.reload */:
            nodeModel.loadNodesTable();
            break;
        case 3 /* System.States.empty */:
            logger_1.default.log("NODE MODEL", "is empty");
            break;
        case 5 /* System.States.limited */:
        case 6 /* System.States.ok */:
        case 7 /* System.States.full */:
            // ok
            break;
        default:
            // not ok
            break;
    }
});
