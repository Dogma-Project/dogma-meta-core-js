"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function response(id, code, message) {
    const res = { id, code };
    if (message)
        res.message = message;
    return res;
}
exports.default = response;
