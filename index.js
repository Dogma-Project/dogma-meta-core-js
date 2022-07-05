'use strict';

const init = () => {
    require("./modules/prototypes");
    require("./modules/migration");
    require("./modules/server");
    require("./modules/client");
    require("./modules/sync");
    const api = require("./modules/api");
    const ee = require("./modules/eventEmitter");
    return { api, ee };
}

module.exports = init;