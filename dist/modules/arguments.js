"use strict";
const args = process.argv.slice(2);
/* Boolean */
const auto = !!args.find(item => item == "--auto");
const discovery = !!args.find(item => item == "--discovery");
/* Strings */
const masterParam = args.find(item => item.indexOf("--master=") > -1);
const master = (!!masterParam) ? masterParam.split("=")[1] : undefined;
const nodeParam = args.find(item => item.indexOf("--node=") > -1);
const node = (!!nodeParam) ? nodeParam.split("=")[1] : undefined;
const prefixParam = args.find(item => item.indexOf("--prefix=") > -1);
const prefix = (!!prefixParam) ? prefixParam.split("=")[1] : undefined;
/* Numbers */
const portParam = args.find(item => item.indexOf("--port=") > -1);
const port = (!!portParam) ? portParam.split("=")[1] : undefined;
const logLevelParam = args.find(item => item.indexOf("--loglevel=") > -1);
const logLevel = (!!logLevelParam) ? logLevelParam.split("=")[1] : undefined;
const interfaceParam = args.find(item => item.indexOf("--interface=") > -1);
const ifport = (!!interfaceParam) ? interfaceParam.split("=")[1] : undefined;
const obj = { auto, discovery, master, node, port, logLevel, prefix, ifport };
module.exports = obj;
