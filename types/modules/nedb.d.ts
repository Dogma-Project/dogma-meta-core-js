import Datastore from "@seald-io/nedb";
interface NedbStores {
    connections: Datastore;
    config: Datastore;
    users: Datastore;
    nodes: Datastore;
    messages: Datastore;
    fileTransfer: Datastore;
    sync: Datastore;
    dht: Datastore;
    protocol: Datastore;
    initPersistDbs(): Promise<boolean>;
}
export declare const dht: Datastore<Record<string, any>>;
export declare const stores: NedbStores;
export {};
