/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
import net from "node:net";
import EventEmitter from "node:events";
import * as Types from "../types";
import { Encoder } from "./streams";
import StateManager from "./state";
import Storage from "./storage";
declare class DogmaSocket extends EventEmitter {
    protected stateBridge: StateManager;
    protected storageBridge: Storage;
    readonly id: Types.Connection.Id;
    private readonly socket;
    input: {
        handshake: Encoder;
        test?: Encoder;
        control?: Encoder;
        messages?: Encoder;
        mail?: Encoder;
        dht?: Encoder;
    };
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
    private _setDecoder;
    private _setEncoder;
    private _setGroup;
    private _onData;
    private _test;
    private _onClose;
    private _onError;
    private _sign;
    private _verify;
    private _sendHandshake;
    /**
     *
     * @todo add data verification
     */
    protected handleHandshake(data: Buffer): void;
    protected handleTest(data: Buffer): void;
    destroy(): net.Socket;
}
export default DogmaSocket;
