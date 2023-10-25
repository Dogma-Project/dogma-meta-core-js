"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dhtModel = void 0;
const state_1 = __importDefault(require("./state"));
const model_1 = require("../modules/model");
const state_2 = __importDefault(require("./state"));
const dhtModel = new model_1.DHTModel({ state: state_1.default });
exports.dhtModel = dhtModel;
state_2.default.subscribe([0 /* Event.Type.start */], () => {
    dhtModel.init();
});
