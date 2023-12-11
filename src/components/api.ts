import { workerData } from "node:worker_threads";

import WebSocketApi from "../modules/api";

const wsApi = new WebSocketApi(workerData.apiPort);

export default wsApi;
