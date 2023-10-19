import { Types } from "../types";
/** @module Store */
/**
 * Default init store
 */
export declare const store: Types.Store;
/**
 *
 * @returns {Promise}
 */
export declare const readConfigTable: () => Promise<any>;
/**
 *
 * @returns {Promise}
 */
export declare const readUsersTable: () => Promise<any>;
/**
 *
 * @returns {Promise}
 */
export declare const readNodesTable: () => Promise<any>;
/**
 * @returns {Promise}
 */
export declare const readProtocolTable: () => Promise<{}>;
/**
 *
 * @returns {Promise}
 */
export declare const checkHomeDir: () => Promise<unknown>;
