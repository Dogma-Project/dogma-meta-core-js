/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
import net from "node:net";
import EventEmitter from "node:events";
import { C_Connection } from "@dogma-project/constants-meta";
import * as Types from "../types";
import { RsaEncoder, AesEncoder, PlainEncoder } from "./streams";
import Storage from "./storage";
import ConnectionClass from "./connections";
declare class DogmaSocket extends EventEmitter {
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
        sync?: AesEncoder;
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
    /**
     * [Peer] User id
     */
    user_id?: Types.User.Id;
    /**
     * [Peer] Node id
     */
    node_id?: Types.Node.Id;
    /**
     * Non-verified [peer] User id
     */
    unverified_user_id?: Types.User.Id;
    /**
     * Non-verified [peer] Node id
     */
    unverified_node_id?: Types.Node.Id;
    /**
     * [Peer] User name
     */
    user_name: Types.User.Name;
    /**
     * [Peer] Node name
     */
    node_name: Types.User.Name;
    readonly peer: Types.Connection.Peer;
    onDisconnect?: Function;
    tested: boolean;
    constructor(socket: net.Socket, direction: C_Connection.Direction, connections: ConnectionClass, storage: Storage);
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
    private sendHandshake;
    /**
     *
     * @todo add data verification
     */
    protected handleHandshake(data: Buffer): void;
    private afterVerification;
    private afterSymmetricKey;
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
