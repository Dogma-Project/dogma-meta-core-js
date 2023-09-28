export namespace store {
    namespace config {
        let router: number;
    }
    let ca: never[];
    let users: never[];
    let nodes: never[];
    namespace node {
        let name: string;
        let key: null;
        let cert: null;
        let id: null;
        let public_ipv4: null;
    }
    namespace user {
        let name_1: string;
        export { name_1 as name };
        let key_1: null;
        export { key_1 as key };
        let cert_1: null;
        export { cert_1 as cert };
        let id_1: null;
        export { id_1 as id };
    }
}
/**
 *
 * @returns {Promise}
 */
declare function readConfigTable(): Promise<any>;
/**
 *
 * @returns {Promise}
 */
declare function readUsersTable(): Promise<any>;
/**
 *
 * @returns {Promise}
 */
declare function readNodesTable(): Promise<any>;
/**
 * @returns {Promise}
 */
declare function readProtocolTable(): Promise<any>;
export { readConfigTable as rconfig, readUsersTable as rusers, readNodesTable as rnodes, readProtocolTable as rprotocol };
