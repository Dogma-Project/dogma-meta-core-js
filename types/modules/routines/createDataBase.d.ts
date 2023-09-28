export function createDataBase(store: Object, defaults: {
    router: any;
    bootstrap: any;
    dhtLookup: any;
    dhtAnnounce: any;
    external: any;
    autoDefine: any;
    public_ipv4: any;
    stun: any;
    turn: any;
}): Promise<any>;
/**
 *
 * @param {Object} defaults
 * @returns {Promise}
 */
declare function createConfigTable(defaults: Object): Promise<any>;
/** @module CreateDataBase */
/**
 *
 * @param {Object} store main app's store
 * @param {Object} store.user
 * @param {String} store.user.name
 * @param {String} store.user.id user hash
 * @param {Buffer} store.user.cert master certificate // check
 */
declare function createUsersTable(store: {
    user: {
        name: string;
        id: string;
        cert: Buffer;
    };
}): Promise<any>;
/**
 *
 * @param {Object} store
 * @param {String} store.user.id
 * @param {String} store.node.name
 * @param {String} store.node.id
 * @param {Object} defaults
 * @param {String} defaults.public_ipv4
 * @param {Number} defaults.router
 */
declare function createNodesTable(store: Object, defaults: {
    public_ipv4: string;
    router: number;
}): Promise<any>;
export { createConfigTable as cconfig, createUsersTable as cusers, createNodesTable as cnodes };
