export = generateMasterKeys;
/**
 * Master keys generator
 * @module GenerateMasterKeys
 */
/**
 *
 * @param {Object} store main app's store
 * @param {Object} params
 * @param {Object} params.name
 * @param {Number} params.length
 * @param {String} params.seed check
 */
declare function generateMasterKeys(store: Object, params: {
    name: Object;
    length: number;
    seed: string;
}): {
    result: number;
    error: unknown;
};
