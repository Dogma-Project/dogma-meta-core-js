import { fs, worker } from "@dogma-project/core-meta-be-node";
import dir from "./datadir";

export default async function checkHomeDir() {
  try {
    if (
      worker.workerData.prefix.indexOf("empty-") > -1 ||
      worker.workerData.prefix.indexOf("test-") > -1
    ) {
      await fs.rm(dir.data, { recursive: true, force: true });
    }
    try {
      await fs.access(dir.nedb);
    } catch (_err) {
      await fs.mkdir(dir.nedb, { recursive: true });
    }
    try {
      await fs.access(dir.keys);
    } catch (_err) {
      await fs.mkdir(dir.keys, { recursive: true });
    }
    return Promise.resolve(true);
  } catch (err) {
    return Promise.reject(err);
  }
}
