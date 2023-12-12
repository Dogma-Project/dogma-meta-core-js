import { API } from "../../../types";
import { C_API } from "@dogma-project/constants-meta";
import process from "node:process";

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

export default function SystemController(
  this: API.DogmaWebSocket,
  data: API.ApiRequest
) {
  switch (data.action) {
    case C_API.ApiRequestAction.get:
      const info = getSystemInfo();
      this.response({
        type: C_API.ApiRequestType.system,
        action: C_API.ApiRequestAction.set,
        payload: {
          system: info,
        },
      });
      break;
  }
}
