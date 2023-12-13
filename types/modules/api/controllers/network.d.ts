import { API } from "../../../types";
export declare function getNetwork(): Promise<API.NetworkData[]>;
export default function NetworkController(this: API.DogmaWebSocket, data: API.ApiRequest): void;
