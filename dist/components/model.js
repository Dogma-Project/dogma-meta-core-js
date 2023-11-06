"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configModel = exports.userModel = exports.nodeModel = exports.dhtModel = void 0;
const state_1 = __importDefault(require("./state"));
const storage_1 = __importDefault(require("./storage"));
const model_1 = require("../modules/model");
const logger_1 = __importDefault(require("../modules/logger"));
const arguments_1 = __importDefault(require("../modules/arguments"));
const constants_1 = require("../constants");
const configModel = new model_1.ConfigModel({ state: state_1.default });
exports.configModel = configModel;
const nodeModel = new model_1.NodeModel({ state: state_1.default });
exports.nodeModel = nodeModel;
const dhtModel = new model_1.DHTModel({ state: state_1.default });
exports.dhtModel = dhtModel;
const userModel = new model_1.UserModel({ state: state_1.default });
exports.userModel = userModel;
state_1.default.subscribe(["START" /* Event.Type.start */, "HOME DIR" /* Event.Type.homeDir */], () => {
    configModel.init();
    nodeModel.init();
    dhtModel.init();
    userModel.init();
});
state_1.default.subscribe(["CONFIG DB" /* Event.Type.configDb */], (value) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        switch (value) {
            case 2 /* System.States.ready */:
            case 4 /* System.States.reload */:
                yield configModel.loadConfigTable();
                break;
            case 3 /* System.States.empty */:
                logger_1.default.log("CONFIG MODEL", "is empty");
                if (arguments_1.default.auto) {
                    logger_1.default.log("CONFIG MODEL", "auto generation with defaults");
                    yield configModel.persistConfig({
                        ["CONFIG ROUTER" /* Event.Type.configRouter */]: constants_1.DEFAULTS.ROUTER,
                        ["CONFIG AUTO DEFINE" /* Event.Type.configAutoDefine */]: constants_1.DEFAULTS.AUTO_DEFINE_IP,
                        ["CONFIG DHT ANNOUNCE" /* Event.Type.configDhtAnnounce */]: 2 /* Connection.Group.friends */,
                        ["CONFIG DHT LOOKUP" /* Event.Type.configDhtLookup */]: 2 /* Connection.Group.friends */,
                        ["CONFIG DHT BOOTSTRAP" /* Event.Type.configDhtBootstrap */]: 2 /* Connection.Group.friends */,
                        ["CONFIG EXTERNAL" /* Event.Type.configExternal */]: constants_1.DEFAULTS.EXTERNAL,
                    });
                }
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
    }
    catch (err) {
        logger_1.default.error("DB LOADER", err);
    }
}));
state_1.default.subscribe(["USERS DB" /* Event.Type.usersDb */, "MASTER KEY" /* Event.Type.masterKey */], (value) => __awaiter(void 0, void 0, void 0, function* () {
    switch (value) {
        case 2 /* System.States.ready */:
        case 4 /* System.States.reload */:
            userModel.loadUsersTable();
            break;
        case 3 /* System.States.empty */:
            logger_1.default.log("USER MODEL", "is empty");
            if (arguments_1.default.auto &&
                state_1.default.state["MASTER KEY" /* Event.Type.masterKey */] === 7 /* System.States.full */) {
                logger_1.default.log("USER MODEL", "auto generation with default");
                yield userModel.persistUser({
                    user_id: storage_1.default.user.id || "",
                    name: constants_1.DEFAULTS.USER_NAME,
                });
            }
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
}));
state_1.default.subscribe(["NODES DB" /* Event.Type.nodesDb */, "NODE KEY" /* Event.Type.nodeKey */], (value) => __awaiter(void 0, void 0, void 0, function* () {
    switch (value) {
        case 2 /* System.States.ready */:
        case 4 /* System.States.reload */:
            nodeModel.loadNodesTable();
            break;
        case 3 /* System.States.empty */:
            logger_1.default.log("NODE MODEL", "is empty");
            if (arguments_1.default.auto &&
                state_1.default.state["NODE KEY" /* Event.Type.nodeKey */] === 7 /* System.States.full */) {
                logger_1.default.log("NODE MODEL", "auto generation with default");
                yield nodeModel.persistNodes([
                    {
                        user_id: storage_1.default.user.id || "",
                        node_id: storage_1.default.node.id || "",
                        name: constants_1.DEFAULTS.NODE_NAME,
                    },
                ]);
            }
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
}));
