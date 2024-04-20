import process from "node:process";
import { API } from "../../../types";
import { C_API } from "../../../constants";
import WorkerApi from "../index";

function getSystemInfo() {
  return {
    ram_usage: process.memoryUsage().rss,
    cpu_usage: process.cpuUsage(),
    title: process.title,
    node_version: process.version,
    platform: process.platform,
    arch: process.arch,
  };
}

export default function SystemController(this: WorkerApi, data: API.Request) {
  switch (data.action) {
    case C_API.ApiRequestAction.get:
      const info = getSystemInfo();
      this.response({
        type: C_API.ApiRequestType.system,
        action: C_API.ApiRequestAction.set,
        id: data.id,
        payload: {
          system: info,
        },
      });
      break;
  }
}
