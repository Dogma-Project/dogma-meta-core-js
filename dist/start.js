"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./modules/prototypes");
require("./components/server");
require("./components/client");
const state_1 = __importDefault(require("./components/state"));
state_1.default.emit(0 /* Event.Type.start */, true);
// import "./components/migration";
// import "./modules/sync";
