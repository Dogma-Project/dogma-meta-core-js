"use strict";
const logger = require("../../logger");
//
const FilesController = require("./files");
const NodesController = require("./nodes");
const SyncController = require("../sync");
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
const RequestsController = ({ node_id, user_id, request }) => {
    if (!request || !request.type || !request.action)
        return logger.warn("requests.js", "unknown request");
    switch (request.type) {
        case "file":
            FilesController.handleRequest({ node_id, user_id, request });
            break;
        case "nodes":
            NodesController.handleRequest({ node_id, user_id, request });
            break;
        case "sync":
            SyncController.handleRequest({ node_id, user_id, request });
            break;
        default:
            logger.warn("requests.js", "unknown request type", request);
            break;
    }
};
module.exports = RequestsController;
