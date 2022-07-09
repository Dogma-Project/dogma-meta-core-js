const args = require("./arguments");
const logger = require("../logger");

const os = require("os");

let homedir;
if (os.platform() == "android") {
    homedir = os.homedir().split("/").slice(0, 4).join("/");
} else {
    homedir = os.homedir();
}

const dogmaDir = homedir + "/.dogma-node";
const datadir = dogmaDir + (args.prefix ? `/${args.prefix}` : "/default");

logger.info("datadir", datadir, "platform:", os.platform());

module.exports = { datadir, dogmaDir };