"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../constants");
const logger_1 = __importDefault(require("../logger"));
const Types = __importStar(require("../../types"));
const response_1 = __importDefault(require("./response"));
function send(request, node_id) {
    try {
        const socket = this.getConnectionByNodeId(node_id);
        if (!socket)
            return (0, response_1.default)(1, constants_1.MSG_CODE.UNKNOWN, "user is offline"); // edit
        switch (request.class) {
            case 6 /* Types.Streams.MX.dht */:
                var str = JSON.stringify(request.body);
                socket.input.dht.write(str);
                return (0, response_1.default)(1, constants_1.MSG_CODE.SUCCESS);
            case 4 /* Types.Streams.MX.messages */:
                var str = JSON.stringify(request.body);
                socket.input.messages.write(str);
                return (0, response_1.default)(1, constants_1.MSG_CODE.SUCCESS);
            default:
                request; // dummy
                break;
        }
    }
    catch (err) {
        logger_1.default.error("connection", "SEND TO NODE::", err);
        return (0, response_1.default)(1, constants_1.MSG_CODE.ERROR, "can't send request"); // edit text
    }
}
exports.default = send;
