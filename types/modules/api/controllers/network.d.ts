import { API } from "../../../types";
import WorkerApi from "../index";
export declare function getNetwork(): Promise<API.NetworkData[]>;
export default function NetworkController(this: WorkerApi, data: API.Request): void;
