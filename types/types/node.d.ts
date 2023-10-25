/// <reference types="node" />
import Connection from "./connection";
import User from "./user";
import Sync from "./sync";
declare namespace Node {
    type Id = string;
    type Name = string;
    type Model = {
        node_id: Node.Id;
        user_id: User.Id;
        name: string;
        public_ipv4?: Connection.IPv4;
        public_ipv6?: Connection.IPv4;
        local_ipv4?: Connection.IPv6;
        local_ipv6?: Connection.IPv6;
        sync_id?: Sync.Id;
    };
    type Storage = {
        id: Id | null;
        name: Name;
        privateKey: Buffer | null;
        publicKey: Buffer | null;
        public_ipv4?: Connection.IPv4;
        local_ipv4?: Connection.IPv4;
    };
}
export default Node;
