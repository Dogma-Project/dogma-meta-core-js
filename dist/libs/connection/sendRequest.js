"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../constants");
function sendRequest(to, request, type) {
    switch (type) {
        case constants_1.MESSAGES.DIRECT:
            return this.sendRequestToNode(to, request);
        case constants_1.MESSAGES.USER:
            return this.sendRequestToUser(to, request);
        case constants_1.MESSAGES.CHAT:
            // edit
            break;
    }
}
exports.default = sendRequest;
