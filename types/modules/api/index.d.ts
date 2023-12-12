import { WebSocketServer } from "ws";
import { API } from "../../types";
export default class WebSocketApi {
    wss: WebSocketServer;
    connections: API.DogmaWebSocket[];
    port: number;
    /**
     *
     * @param port Set specific port for WS API
     */
    constructor(port: number);
    private onConnect;
    private socketOnMessage;
    private socketOnError;
}
