"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connections_1 = __importDefault(require("../modules/connections"));
const storage_1 = __importDefault(require("./storage"));
const state_1 = __importDefault(require("./state"));
const connection = new connections_1.default({ storage: storage_1.default, state: state_1.default });
exports.default = connection;
