'use strict';

require("./modules/prototypes");
require("./modules/migration");
require("./modules/server");
require("./modules/client");
require("./modules/sync"); // edit

const api = require("./modules/api");
const ee = require("./modules/eventEmitter");

module.exports.api = api;
module.exports.ee = ee;