"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../constants");
function sendMessage(to, message, type) {
    switch (type) {
        case constants_1.MESSAGES.DIRECT:
            return this.sendMessageToNode(to, message);
        case constants_1.MESSAGES.USER:
            return this.sendMessageToUser(to, message);
        case constants_1.MESSAGES.CHAT:
            // edit
            break;
    }
}
exports.default = sendMessage;
