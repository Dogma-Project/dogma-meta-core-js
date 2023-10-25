/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
import net from "node:net";
import EventEmitter from "node:events";
import * as Types from "../types";
import { MuxStream } from "./streams";
import StateManager from "./state";
/**
 * @todo add online event
 */
declare class DogmaSocket extends EventEmitter {
    readonly id: Types.Connection.Id;
    user_id: Types.User.Id | null;
    node_id: Types.Node.Id | null;
    stateBridge: StateManager;
    private readonly socket;
    input: {
        handshake: MuxStream;
        test: MuxStream;
        control: MuxStream;
        messages: MuxStream;
        mail: MuxStream;
        dht: MuxStream;
    };
    private readonly output;
    readonly direction: Types.Connection.Direction;
    status: Types.Connection.Status;
    group: Types.Connection.Group;
    outSession: string;
    inSession?: string;
    publicUserKey: any;
    publicNodeKey: any;
    onDisconnect?: Function;
    tested: boolean;
    constructor(socket: net.Socket, direction: Types.Connection.Direction, state: StateManager);
    private setPipes;
    private _onData;
    private _onClose;
    private onError;
    handleHandshake(data: Buffer): void;
    handleTest(data: Buffer): void;
    destroy(): net.Socket;
}
export default DogmaSocket;
