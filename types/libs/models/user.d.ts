import { Types } from "../../types";
declare const model: {
    getAll(): Promise<any>;
    /**
     *
     * @param {Object} user
     * @param {String} user.name
     * @param {String} user.user_id
     * @param {String} user.cert
     * @param {Number} user.type
     * @returns {Promise}
     */
    persistUser(user: Types.User.Model): Promise<any>;
    /**
     * @todo set to deleted state instead of remove
     */
    removeUser(user_id: Types.User.Id): Promise<boolean>;
    /**
     * @todo delete _id
     */
    sync(data: Types.User.Model[], from: Types.User.Id): Promise<boolean>;
};
export default model;
