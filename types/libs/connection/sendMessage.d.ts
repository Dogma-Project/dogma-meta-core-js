import Connection from "../connection";
export default function sendMessage(this: Connection, to: string, message: any, type: number): Promise<void> | Promise<import("../../types").Types.Response.Main> | undefined;
