"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../../libs/logger"));
const files_1 = __importDefault(require("./files"));
const nodes_1 = __importDefault(require("./nodes"));
const sync_1 = __importDefault(require("../../libs/sync"));
/** @module RequestsController */
/**
 *
 * @param {Object} params
 * @param {String} params.node_id
 * @param {String} params.user_id
 * @param {Object} params.request
 * @param {String} params.request.type
 * @param {String} params.request.action
 * @param {Object} params.request.data
 */
const RequestsController = (node_id, user_id, request) => {
    if (!request || !request.type || !request.action)
        return logger_1.default.warn("requests.js", "unknown request");
    switch (request.type) {
        case "file":
            files_1.default.handleRequest({ node_id, user_id, request });
            break;
        case "nodes":
            nodes_1.default.handleRequest({ node_id, user_id, request });
            break;
        case "sync":
            sync_1.default.handleRequest({ node_id, user_id, request });
            break;
        default:
            logger_1.default.warn("requests.js", "unknown request type", request);
            break;
    }
};
exports.default = RequestsController;
