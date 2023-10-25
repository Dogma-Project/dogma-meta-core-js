import Connection from "./connection";
import Node from "./node";
import Streams from "./streams";
import User from "./user";
declare namespace DHT {
    const enum Type {
        dhtAnnounce = 0,
        dhtLookup = 1,
        dhtBootstrap = 2
    }
    const enum Action {
        get = 0,
        set = 1,
        push = 2
    }
    const enum Request {
        announce = 0,
        lookup = 1,
        revoke = 2
    }
    const enum Response {
        alreadyPresent = 0,
        ok = 1
    }
    type Model = {
        user_id: User.Id;
        node_id: Node.Id;
        public_ipv4: Connection.IPv4;
        port: number;
    };
    namespace LookUp {
        interface Request {
            type: DHT.Request.lookup;
            action: DHT.Action.get;
            data: Request.Data;
        }
        namespace Request {
            type Data = {
                user_id: User.Id;
                node_id?: Node.Id;
            };
        }
        interface Answer {
            type: DHT.Request.lookup;
            action: DHT.Action.set;
            data: Answer.Data[];
        }
        namespace Answer {
            type Data = {
                public_ipv4: string;
                user_id: User.Id;
                node_id: Node.Id;
            };
        }
    }
    namespace Announce {
        interface Request {
            type: DHT.Request.announce;
            action: DHT.Action.push;
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
            type: DHT.Request.revoke;
            action: DHT.Action.push;
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
        class: Streams.MX.dht;
        body: DHT.Requests;
    };
}
export default DHT;
