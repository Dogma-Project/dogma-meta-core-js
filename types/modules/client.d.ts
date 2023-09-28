export function connect(peer: {
    host: string;
    port: number;
}): void;
export function test(peer: {
    host: string;
    port: number;
}, cb: Function): void;
export function permitUnauthorized(): boolean;
/**
 * @param {Object} peer
 * @param {String} peer.host IpAddr
 * @param {Number} peer.port Port
 * @param {Object} from
 * @param {String} from.user_id
 * @param {String} from.node_id
 * @todo add node_id connected status checker
 */
export function tryPeer(peer: {
    host: string;
    port: number;
}, from: {
    user_id: string;
    node_id: string;
}): any;
export function getOwnNodes(): Promise<any>;
export function searchFriends(): void;
export function connectFriends(): void;
export function dhtLookup(user_id: string): void;
