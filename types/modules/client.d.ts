import * as Types from "../types";
import StateManager from "./state";
import Storage from "./storage";
import Connections from "./connections";
export default class Client {
    connectionsBridge: Connections;
    stateBridge: StateManager;
    storageBridge: Storage;
    modelsBridge: Types.Model.All;
    constructor({ connections, state, storage, models, }: {
        connections: Connections;
        state: StateManager;
        storage: Storage;
        models: Types.Model.All;
    });
    private _connect;
    /**
     *
     * @todo edit
     */
    tryPeer(peer: Types.Connection.Peer, node: {
        user_id: Types.User.Id;
        node_id: Types.Node.Id;
    }): Promise<void>;
    test(peer: Types.Connection.Peer, cb: (result: boolean) => void): void;
    connectFriends(): Promise<void>;
}
