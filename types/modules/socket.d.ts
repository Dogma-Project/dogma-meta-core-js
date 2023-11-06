/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
import net from "node:net";
import EventEmitter from "node:events";
import * as Types from "../types";
import { MuxStream } from "./streams";
import StateManager from "./state";
import Storage from "./storage";
/**
 * @todo add online event
 */
declare class DogmaSocket extends EventEmitter {
    protected stateBridge: StateManager;
    protected storageBridge: Storage;
    readonly id: Types.Connection.Id;
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
    private outSession;
    private inSession?;
    private publicUserKey?;
    private publicNodeKey?;
    user_id?: Types.User.Id;
    node_id?: Types.Node.Id;
    unverified_user_id?: Types.User.Id;
    unverified_node_id?: Types.Node.Id;
    onDisconnect?: Function;
    tested: boolean;
    constructor(socket: net.Socket, direction: Types.Connection.Direction, state: StateManager, storage: Storage);
    private setDecryptor;
    private setHandshakeSubStream;
    private setEncryptor;
    private _onData;
    private _onClose;
    private onError;
    private sendHandshake;
    /**
     *
     * @todo add verification
     */
    protected handleHandshake(data: Buffer): void;
    protected handleTest(data: Buffer): void;
    destroy(): net.Socket;
}
export default DogmaSocket;
