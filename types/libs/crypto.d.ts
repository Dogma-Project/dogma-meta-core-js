import { pki } from "node-forge";
import { User } from "./model";
import { Types } from "../types";
/** @module Crypt */
/**
 *
 * @param {Object} pemCert
 * @param {Boolean} formatted
 * @returns {String}
 * @todo certificateFromPem-> computeHash
 * @todo delete formatted
 */
export declare const getPublicCertHash: (pemCert: string, formatted?: boolean) => string | undefined;
export declare const publicKeyFingerprint: (publicKey: pki.PublicKey) => string;
/**
 * Generate base64 Dogma certificate
 */
export declare const getDogmaCertificate: (store: Types.Store) => Promise<unknown>;
/**
 *
 * @param {String} commonName
 * @param {Object} publicKey
 * @returns {Boolean} result
 */
export declare const validateCommonName: (commonName: string, publicKey: pki.PublicKey) => boolean;
/**
 *
 * @param pem node cert
 * @todo checkings and validation
 */
export declare const getNamesFromNodeCert: (pem: string) => {
    user_name: any;
    node_name: any;
};
/**
 * Validate and parse base64 certificate
 * @param {String} cert base64 { pubKey, public_ipv4, port }
 * @param {String} user_id own user_id
 * @returns {Object} result, error, "user_id", "name", {cert}, {node}, !!own
 */
export declare const validateDogmaCertificate: (certB64: string, user_id: Types.User.Id) => {
    result: number;
    error: any;
} | {
    result: number;
    error: null;
    user_id: string | undefined;
    name: any;
    cert: any;
    node: {
        name: any;
        node_id: any;
        public_ipv4: any;
        port: any;
    };
    own: number;
};
/**
 * Persist parsed result of validateDogmaCertificate function
 * @param {Object} data result of certificate validation
 * @param {String} data.name
 * @param {String} data.user_id
 * @param {String} data.cert
 * @param {Number} data.own
 * @param {Object} data.node
 * @param {String} data.node.name
 * @param {String} data.node.node_id
 * @param {String} data.node.public_ipv4
 * @param {Number} data.node.port
 * @return {Promise} result:boolean
 */
export declare const addDogmaCertificate: (data: Types.Certificate.Validation.Result) => Promise<any>;
