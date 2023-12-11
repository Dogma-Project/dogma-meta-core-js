/// <reference types="node" />
import { IncomingMessage } from "node:http";
import { System } from "../../types";
export default function Request(req: IncomingMessage): System.API.Request;
