/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
import net from "node:net";
import EventEmitter from "node:events";
import { C_Connection } from "@dogma-project/constants-meta";
import * as Types from "../types";
import { RsaEncoder, AesEncoder, PlainEncoder } from "./streams";
import StateManager from "./state";
import Storage from "./storage";
import ConnectionClass from "./connections";
declare class DogmaSocket extends EventEmitter {
    protected stateBridge: StateManager;
    protected storageBridge: Storage;
    protected connectionsBridge: ConnectionClass;
    readonly id: Types.Connection.Id;
    private readonly socket;
    input: {
        handshake: PlainEncoder;
        key?: RsaEncoder;
        test?: AesEncoder;
        control?: AesEncoder;
        messages?: AesEncoder;
        mail?: AesEncoder;
        dht?: AesEncoder;
        web?: AesEncoder;
        file?: AesEncoder;
        relay?: AesEncoder;
    };
    private decoder?;
    readonly direction: C_Connection.Direction;
    status: C_Connection.Status;
    group: C_Connection.Group;
    private readonly outSession;
    private inSession?;
    private outSymmetricKey?;
    private readonly inSymmetricKey;
    private publicUserKey?;
    private publicNodeKey?;
    user_id?: Types.User.Id;
    node_id?: Types.Node.Id;
    unverified_user_id?: Types.User.Id;
    unverified_node_id?: Types.Node.Id;
    readonly peer: Types.Connection.Peer;
    onDisconnect?: Function;
    tested: boolean;
    constructor(socket: net.Socket, direction: C_Connection.Direction, connections: ConnectionClass, state: StateManager, storage: Storage);
    private setDecoder;
    private setRsaEncoders;
    private setAesEncoders;
    /**
     * Determine connection group and authorization status
     */
    private setGroup;
    /**
     * @todo complete
     * Check if not authorized can connect
     */
    private checkGroup;
    private test;
    private sendSymmetricKey;
    private onData;
    private onClose;
    private onError;
    private sign;
    private verify;
    private sendHandshake;
    /**
     *
     * @todo add data verification
     */
    protected handleHandshake(data: Buffer): void;
    private afterVerification;
    private afterSymmetricKey;
    /**
     * Successfully tested AES encryption
     */
    private afterTest;
    /**
     * @todo skip when discovery
     * Determine peer is online
     * @param data
     */
    protected handleTest(data: Buffer): void;
    /**
     * Sets peer symmetric key
     * @param data
     */
    protected handleSymmetricKey(data: Buffer): void;
    /**
     * Stop current connection with specific reason
     * @param reason
     * @returns
     */
    destroy(reason?: string): net.Socket;
}
export default DogmaSocket;
