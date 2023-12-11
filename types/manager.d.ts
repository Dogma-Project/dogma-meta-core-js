/// <reference types="node" />
import http from "node:http";
export default function RunManager(port?: number): http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
