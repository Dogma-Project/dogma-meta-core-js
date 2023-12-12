/// <reference types="node" />
import { Sync } from "./sync";
export declare namespace User {
    type Id = string;
    type Name = string;
    type Model = {
        user_id: Id;
        name: string;
        avatar?: string;
        sync_id?: Sync.Id;
        requested?: true;
    };
    type Storage = {
        id: Id | null;
        name: Name;
        privateKey: Buffer | null;
        publicKey: Buffer | null;
    };
}
