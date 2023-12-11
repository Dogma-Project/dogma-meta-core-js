import WebSocket, { WebSocketServer } from "ws";
interface DogmaWebSocket extends WebSocket {
    dogmaId: string;
}
export default class WebSocketApi {
    wss: WebSocketServer;
    connections: DogmaWebSocket[];
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
}
export {};
