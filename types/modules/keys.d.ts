/// <reference types="node" />
import { Keys } from "../types";
import { C_Keys } from "@dogma-project/constants-meta";
export declare function createKeyPair(type: C_Keys.Type, prefix: string, length?: Keys.InitialParams["keylength"]): Promise<boolean>;
export declare function readOrCreateEncryptionKey(prefix: string, publicKey: Buffer, privateKey: Buffer): Promise<string>;
