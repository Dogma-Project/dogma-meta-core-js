import { Types } from "../types";
/**
 * Master keys generator
 * @module GenerateMasterKeys
 */
declare const generateMasterKeys: (store: Types.Store, params: Types.Key.InitialParams) => {
    result: number;
    error: unknown;
};
export default generateMasterKeys;
