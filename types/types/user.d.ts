/// <reference types="node" />
import Sync from "./sync";
declare namespace User {
    type Id = string;
    type Name = string;
    type Model = {
        user_id: Id;
        name: string;
        avatar?: string;
        sync_id?: Sync.Id;
    };
    type Storage = {
        id: Id | null;
        name: Name;
        privateKey: Buffer | null;
        publicKey: Buffer | null;
    };
}
export default User;
