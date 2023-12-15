/// <reference types="node" />
import { MessagePort } from "node:worker_threads";
import { API } from "../../types";
export default class WorkerApi {
    parentPort: MessagePort | null;
    constructor();
    private servicesController;
    private settingsController;
    private keysController;
    private networkController;
    private systemController;
    private handle;
    protected response(data: API.ResponseRequest): void;
    notify(data: Omit<API.ResponseRequest, "id">): void;
}
