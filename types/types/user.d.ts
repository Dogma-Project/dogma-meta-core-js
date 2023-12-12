/// <reference types="node" />
import { Sync } from "./sync";
export declare namespace User {
    type Id = string;
    type Name = string;
    interface Model {
        [index: string | symbol]: Id | string | Sync.Id | boolean | undefined | number;
        user_id: Id;
        name: string;
        avatar?: string;
        sync_id?: Sync.Id;
        requested?: true;
    }
    type Storage = {
        id: Id | null;
        name: Name;
        privateKey: Buffer | null;
        publicKey: Buffer | null;
    };
}
