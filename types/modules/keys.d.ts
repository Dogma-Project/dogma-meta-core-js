import { Keys } from "../types";
export declare function createKeyPair(type: Keys.Type, prefix: string, length?: Keys.InitialParams["keylength"]): Promise<boolean>;
