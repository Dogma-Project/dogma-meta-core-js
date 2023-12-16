import { User } from "../../types";
import Datastore from "@seald-io/nedb";
import Model from "./_model";
import StateManager from "../state";
import { C_Sync } from "@dogma-project/constants-meta";
declare class UserModel implements Model {
    stateBridge: StateManager;
    db: Datastore;
    encrypt: boolean;
    private projection;
    syncType: C_Sync.Type;
    constructor({ state }: {
        state: StateManager;
    });
    init(encryptionKey?: string): Promise<void>;
    getAll(): Promise<User.Model[]>;
    get(user_id: User.Id): Promise<User.Model>;
    /**
     *
     * @param from Timestamp in milliseconds
     * @returns
     */
    getSync(from: number): Promise<User.Model[]>;
    pushSync(data: Record<string, any>[]): Promise<undefined>;
    loadUsersTable(): Promise<void>;
    /**
     * Persist some user
     */
    persistUser(row: User.Model): Promise<{
        numAffected: number;
        affectedDocuments: import("@seald-io/nedb").Document<User.Model> | import("@seald-io/nedb").Document<User.Model>[] | null;
        upsert: boolean;
    }>;
    /**
     *
     * @param users array of users to persist
     * @returns {Promise}
     */
    persistUsers(users: User.Model[]): Promise<boolean>;
    removeUser(user_id: User.Id): Promise<{
        numAffected: number;
        affectedDocuments: import("@seald-io/nedb").Document<User.Model> | import("@seald-io/nedb").Document<User.Model>[] | null;
        upsert: boolean;
    }>;
}
export default UserModel;
