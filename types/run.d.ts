/// <reference types="node" />
import { C_System } from "@dogma-project/constants-meta";
import { EventEmitter } from "node:stream";
import { API } from "./types";
interface WorkerData {
    prefix: string;
    /**
     * enforces router port ignoring settings
     */
    routerPort?: number;
    /**
     * auto generate node. default: false
     */
    auto?: boolean;
    /**
     * force node to run as passive discovery server. default: false
     */
    discovery?: boolean;
    /**
     * sets log level. default: C_System.LogLevel.info
     */
    loglevel?: C_System.LogLevel;
}
export default class RunWorker extends EventEmitter {
    private worker;
    id: string;
    name: string;
    constructor(data: WorkerData);
    emit(eventName: "state", payload: API.ResponseEvent): boolean;
    emit(eventName: "exit", exitCode: number): boolean;
    emit(eventName: "notify", payload: Omit<API.Response, "id">): boolean;
    on(eventName: "state", listener: (payload: API.ResponseEvent) => void): this;
    on(eventName: "exit", listener: (exitCode: number) => void): this;
    on(eventName: "notify", listener: (payload: Omit<API.Response, "id">) => void): this;
    request(data: Omit<API.Request, "id">): Promise<Omit<API.Response, "id">>;
    send(data: Omit<API.Request, "id">): void;
    stop(): Promise<number>;
}
export {};
