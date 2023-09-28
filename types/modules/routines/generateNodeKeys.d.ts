export = generateNodeKeys;
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
declare function generateNodeKeys(store: Object, params: {
    name: Object;
    length: number;
    seed: string;
}): {
    result: number;
    error: unknown;
};
