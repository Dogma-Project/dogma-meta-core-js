import { User } from "../../types";
import Datastore from "@seald-io/nedb";
import Model from "./_model";
import StateManager from "../state";
declare class UserModel implements Model {
    stateBridge: StateManager;
    db: Datastore;
    constructor({ state }: {
        state: StateManager;
    });
    init(): Promise<void>;
    getAll(): Promise<Record<string, any>[]>;
    loadUsersTable(): Promise<void>;
    /**
     *
     * @param users array of users to persist
     * @returns {Promise}
     */
    persistUsers(users: User.Model[]): Promise<unknown>;
    /**
     * @todo set to deleted state instead of remove
     */
    removeUser(user_id: User.Id): Promise<boolean>;
    /**
     * @todo delete _id
     */
    sync(data: User.Model[], from: User.Id): Promise<boolean>;
}
export default UserModel;
