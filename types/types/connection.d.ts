import DogmaSocket from "../modules/socket";
import { User } from "./user";
import { Node } from "./node";
import { C_Connection } from "@dogma-project/constants-meta";
export declare namespace Connection {
    type Id = string;
    type IPv4 = string;
    type IPv6 = string;
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
            stage: C_Connection.Stage.init;
            protocol: 2;
            session: string;
            user_id: User.Id;
            user_name: string;
            node_id: Node.Id;
            node_name: string;
        };
        type StageVerificationRequest = {
            stage: C_Connection.Stage.verification;
            userKey: string;
            userSign: string;
            nodeKey: string;
            nodeSign: string;
        };
    }
}
