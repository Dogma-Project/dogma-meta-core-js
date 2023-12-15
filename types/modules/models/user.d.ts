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
    getAll(): Promise<Record<string, any>[]>;
    /**
     *
     * @param from Timestamp in milliseconds
     * @returns
     */
    getSync(from: number): Promise<Record<string, any>[]>;
    /**
     * @todo log result
     * @param data
     * @returns
     */
    pushSync(data: Record<string, any>[]): Promise<void>;
    loadUsersTable(): Promise<void>;
    private loadUser;
    /**
     * @todo delete proxy
     * Persist some user
     */
    persistUser(row: User.Model): Promise<{
        numAffected: number;
        affectedDocuments: import("@seald-io/nedb").Document<Record<string, any>> | import("@seald-io/nedb").Document<Record<string, any>>[] | null;
        upsert: boolean;
    }>;
    /**
     *
     * @param users array of users to persist
     * @returns {Promise}
     */
    persistUsers(users: User.Model[]): Promise<boolean>;
    /**
     * @todo set to deleted state instead of remove
     */
    removeUser(user_id: User.Id): Promise<boolean>;
}
export default UserModel;
