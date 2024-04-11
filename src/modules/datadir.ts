import os from "node:os";
import path from "node:path";
import { workerData } from "node:worker_threads";

const main = path.join(os.homedir(), "/.dogma-node");
const data = path.join(main, `/${workerData.prefix}`);
const nedb = path.join(data, "/nedb");
const keys = path.join(data, "/keys");

export default {
  main,
  data,
  nedb,
  keys,
};
