"use strict";
const args = require("./arguments");
const dogmaDir = require('os').homedir() + "/.dogma-node";
const datadir = dogmaDir + (args.prefix ? `/${args.prefix}` : "/default");
module.exports = { datadir, dogmaDir };
