import { os, path, worker } from "@dogma-project/core-host-api";

const main = path.join(os.homedir(), "/.dogma-node");
const data = path.join(main, `/${worker.workerData.prefix}`);
const nedb = path.join(data, "/nedb");
const keys = path.join(data, "/keys");

export default {
  main,
  data,
  nedb,
  keys,
};
