import { WebSocketServer } from "ws";
import { API } from "../../types";
export default class WebSocketApi {
    wss: WebSocketServer;
    connections: API.DogmaWebSocket[];
    private minPort;
    private maxPort;
    port: number;
    /**
     *
     * @param port Enforce specific port for WS API
     */
    constructor(port?: number);
    private getRandomPort;
    private onConnect;
    private socketOnMessage;
    private socketOnError;
}
