import DogmaSocket from "../modules/socket";
import User from "./user";
import Node from "./node";
declare namespace Connection {
    type Id = string;
    type IPv4 = string;
    type IPv6 = string;
    enum Status {
        notConnected,
        connected,
        error,
        notAuthorized,
        authorized
    }
    enum Group {
        unknown,
        all,
        friends,
        selfUser,
        selfNode,
        nobody
    }
    enum Direction {
        outcoming,
        incoming
    }
    interface Description {
        connection_id: Id;
        address: string;
        user_id: User.Id;
        node_id: Node.Id;
        status: number;
    }
    type SocketArray = {
        [index: string]: DogmaSocket;
    };
    type Peer = {
        host: string;
        port: number;
        address: string;
        public?: boolean;
        version?: 4 | 6;
    };
}
export default Connection;
