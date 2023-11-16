/**
 *
 * @param {String} ip "192.168.0.2"
 */
export declare const convertToBroadcast: (ip: string) => string;
/**
 *
 * @param {String} ip "192.168.0.2"
 */
export declare const getLocalAddress: (ip?: string) => {
    address: string;
    broadcast: string;
};
