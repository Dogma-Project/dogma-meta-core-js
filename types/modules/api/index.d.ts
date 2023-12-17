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
    private nodeController;
    private handle;
    notify(data: Omit<API.ResponseRequest, "id"> | API.ResponseError): void;
    protected response(data: API.ResponseRequest): void;
    protected error(data: API.ResponseError): void;
}
