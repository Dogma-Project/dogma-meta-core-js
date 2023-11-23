import DogmaSocket from "../modules/socket";
import { User } from "./user";
import { Node } from "./node";
export declare namespace Connection {
    type Id = string;
    type IPv4 = string;
    type IPv6 = string;
    enum Status {
        error = -1,
        notConnected = 0,
        connected = 1,
        notAuthorized = 2,
        authorized = 3
    }
    enum Group {
        unknown = 0,
        all = 1,
        friends = 2,
        selfUser = 3,
        selfNode = 4,
        nobody = 5
    }
    enum Direction {
        outcoming = 0,
        incoming = 1
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
    namespace Handshake {
        type StageInitRequest = {
            stage: Stage.init;
            protocol: 1;
            session: string;
            user_id: User.Id;
            node_id: Node.Id;
        };
        type StageVerificationRequest = {
            stage: Stage.verification;
            userKey: string;
            userSign: string;
            nodeKey: string;
            nodeSign: string;
        };
        enum Stage {
            init = 0,
            verification = 1
        }
    }
}
