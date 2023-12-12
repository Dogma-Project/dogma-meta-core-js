import { C_System } from "@dogma-project/constants-meta";
interface WorkerData {
    prefix: string;
    /**
     * Sets API port
     */
    apiPort: number;
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
export default class RunWorker {
    private worker;
    id: string;
    apiPort: number;
    name: string;
    constructor(data: WorkerData);
    stop(): Promise<number>;
}
export {};
