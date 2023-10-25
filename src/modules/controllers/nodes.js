// import { Node } from "../model";
// import logger from "../logger";
// import { MESSAGES } from "../../constants";
// import * as Types from "../../types";

// /** @module NodesController */

// /**
//  *
//  * @param {Array} nodes
//  */
// const validateAndFilterNodes = (nodes) => {
//   // edit
//   return nodes.map((node) => {
//     const { name, user_id, node_id, public_ipv4, router_port } = node;
//     return {
//       name,
//       user_id,
//       node_id: node_id.toPlainHex(),
//       public_ipv4,
//       router_port,
//     };
//   });
// };

// const nodes = {
//   /**
//    *
//    * @param {Object} params
//    * @param {String} params.node_id
//    * @param {Object} params.request
//    * @param {String} params.request.type
//    * @param {String} params.request.action
//    * @param {Object} params.request.data
//    */
//   async handleRequest(node_id: Types.Node.Id, request: object) {
//     const { getOwnNodes } = require("../client"); // circular
//     const {
//       data: { from },
//     } = request;

//     switch (request.action) {
//       case "get": // store.nodes
//         const connection = require("../connection"); // edit
//         try {
//           const result = await getOwnNodes();
//           const getNodes = validateAndFilterNodes(result);
//           connection.sendRequest(
//             node_id,
//             {
//               type: "nodes",
//               action: "update",
//               data: {
//                 nodes: getNodes,
//               },
//             },
//             MESSAGES.DIRECT
//           );
//         } catch (err) {
//           logger.error("nodes controller", err);
//         }
//         break;
//       case "update":
//         if (!request.data || !request.data.nodes)
//           return logger.warn("NODES", "there's no nodes to persist");
//         const setNodes = validateAndFilterNodes(request.data.nodes);
//         Node.persistNodes(setNodes)
//           .then((result) => {
//             logger.log("NODES controller", "persist nodes success", result);
//           })
//           .catch((error) => {
//             logger.error("NODES controller", "persist nodes error", error);
//           });
//         break;
//     }
//   },
// };

// export default nodes;
