export function getPublicCertHash(pemCert: Object, formatted: boolean): string;
export function publicKeyFingerprint(publicKey: Object): string;
export function getDogmaCertificate(store: {
    config: {
        router: number;
    };
    user: {
        cert: Buffer;
    };
    node: {
        name: string;
        id: string;
        public_ipv4: string;
    };
}): Promise<any>;
/**
 *
 * @param {String} commonName
 * @param {Object} publicKey
 * @returns {Boolean} result
 */
export function validateCommonName(commonName: string, publicKey: Object): boolean;
/**
 *
 * @param {String} pem node cert
 * @todo checkings and validation
 */
export function getNamesFromNodeCert(pem: string): {
    user_name: any;
    node_name: any;
};
/**
 * Validate and parse base64 certificate
 * @param {String} cert base64 { pubKey, public_ipv4, port }
 * @param {String} user_id own user_id
 * @returns {Object} result, error, "user_id", "name", {cert}, {node}, !!own
 */
export function validateDogmaCertificate(cert: string, user_id: string): Object;
export function addDogmaCertificate(data: {
    name: string;
    user_id: string;
    cert: string;
    own: number;
    node: {
        name: string;
        node_id: string;
        public_ipv4: string;
        port: number;
    };
}): Promise<any>;
