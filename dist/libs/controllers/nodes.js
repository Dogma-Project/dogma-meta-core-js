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
const model_1 = require("../../libs/model");
const logger_1 = __importDefault(require("../../libs/logger"));
const constants_1 = require("../../constants");
/** @module NodesController */
/**
 *
 * @param {Array} nodes
 */
const validateAndFilterNodes = (nodes) => {
    // edit
    return nodes.map((node) => {
        const { name, user_id, node_id, public_ipv4, router_port } = node;
        return {
            name,
            user_id,
            node_id: node_id.toPlainHex(),
            public_ipv4,
            router_port,
        };
    });
};
const nodes = {
    /**
     *
     * @param {Object} params
     * @param {String} params.node_id
     * @param {Object} params.request
     * @param {String} params.request.type
     * @param {String} params.request.action
     * @param {Object} params.request.data
     */
    handleRequest(node_id, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const { getOwnNodes } = require("../client"); // circular
            const { data: { from }, } = request;
            switch (request.action) {
                case "get": // store.nodes
                    const connection = require("../connection"); // edit
                    try {
                        const result = yield getOwnNodes();
                        const getNodes = validateAndFilterNodes(result);
                        connection.sendRequest(node_id, {
                            type: "nodes",
                            action: "update",
                            data: {
                                nodes: getNodes,
                            },
                        }, constants_1.MESSAGES.DIRECT);
                    }
                    catch (err) {
                        logger_1.default.error("nodes controller", err);
                    }
                    break;
                case "update":
                    if (!request.data || !request.data.nodes)
                        return logger_1.default.warn("NODES", "there's no nodes to persist");
                    const setNodes = validateAndFilterNodes(request.data.nodes);
                    model_1.Node.persistNodes(setNodes)
                        .then((result) => {
                        logger_1.default.log("NODES controller", "persist nodes success", result);
                    })
                        .catch((error) => {
                        logger_1.default.error("NODES controller", "persist nodes error", error);
                    });
                    break;
            }
        });
    },
};
exports.default = nodes;
