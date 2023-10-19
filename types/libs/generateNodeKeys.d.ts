import { Types } from "../types";
/**
 * Node keys generator
 * @module GenerateNodeKeys
 */
/**
 *
 * @param {Object} store main app's store
 * @param {Object} params
 * @param {Object} params.name
 * @param {Number} params.length
 * @param {String} params.seed check
 */
declare const generateNodeKeys: (store: Types.Store, params: Types.Key.InitialParams) => {
    result: number;
    error: unknown;
};
export default generateNodeKeys;
