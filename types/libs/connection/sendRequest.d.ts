import Connection from "../connection";
export default function sendRequest(this: Connection, to: string, request: any, type: number): Promise<void> | Promise<import("../../types").Types.Response.Main> | undefined;
