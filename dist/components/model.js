"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dhtModel = void 0;
const state_1 = __importDefault(require("./state"));
const state_2 = __importDefault(require("./state"));
const model_1 = require("../modules/model");
const configModel = new model_1.ConfigModel({ state: state_1.default });
const nodeModel = new model_1.NodeModel({ state: state_1.default });
const dhtModel = new model_1.DHTModel({ state: state_1.default });
exports.dhtModel = dhtModel;
const userModel = new model_1.UserModel({ state: state_1.default });
state_2.default.subscribe([0 /* Event.Type.start */, 31 /* Event.Type.homeDir */], () => {
    configModel.init();
    nodeModel.init();
    dhtModel.init();
    userModel.init();
});
