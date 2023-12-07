import { Connection } from "./connection";
import { Node } from "./node";
import { User } from "./user";
import { C_DHT, C_Streams } from "@dogma-project/constants-meta";
export declare namespace DHT {
    type Model = {
        user_id: User.Id;
        node_id: Node.Id;
        public_ipv4: Connection.IPv4;
        port: number;
    };
    namespace LookUp {
        interface Request {
            type: C_DHT.Request.lookup;
            action: C_DHT.Action.get;
            data: Request.Data;
        }
        namespace Request {
            type Data = {
                user_id: User.Id;
                node_id?: Node.Id;
            };
        }
        interface Answer {
            type: C_DHT.Request.lookup;
            action: C_DHT.Action.set;
            data: Answer.Data[];
        }
        namespace Answer {
            type Data = {
                public_ipv4: string;
                user_id: User.Id;
                node_id: Node.Id;
            };
        }
        type Common = Request | Answer;
    }
    namespace Announce {
        interface Request {
            type: C_DHT.Request.announce;
            action: C_DHT.Action.push;
            data: Request.Data;
        }
        namespace Request {
            type Data = {
                port: number;
            };
        }
    }
    namespace Revoke {
        interface Request {
            type: C_DHT.Request.revoke;
            action: C_DHT.Action.push;
            data: Request.Data;
        }
        namespace Request {
            type Data = {};
        }
    }
    type FromData = {
        user_id: User.Id;
        node_id: Node.Id;
        public_ipv4: string;
    };
    type Requests = LookUp.Request | Announce.Request | Revoke.Request;
    type CardQuery<T> = {
        request: T;
        from: FromData;
    };
    type CardAnswer = {
        request: LookUp.Answer;
        from: FromData;
    };
    type Card = CardQuery<Requests> | CardAnswer;
    type Abstract = {
        class: C_Streams.MX.dht;
        body: DHT.Requests;
    };
}
