import { User } from "../../types";
import Datastore from "@seald-io/nedb";
import Model from "./_model";
import StateManager from "../state";
declare class UserModel implements Model {
    stateBridge: StateManager;
    db: Datastore;
    encrypt: boolean;
    private projection;
    constructor({ state }: {
        state: StateManager;
    });
    init(encryptionKey?: string): Promise<void>;
    getAll(): Promise<Record<string, any>[]>;
    /**
     * Update some value directly
     * @param i
     * @returns
     */
    private makeProxy;
    loadUsersTable(): Promise<void>;
    /**
     * Persist some user
     * @param row
     * @returns
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
    /**
     * Update some data by proxy
     * @param user_id
     * @param key
     * @param value
     * @returns
     */
    private updateUserData;
    /**
     * @todo delete _id
     */
    sync(data: User.Model[], from: User.Id): Promise<boolean>;
}
export default UserModel;
