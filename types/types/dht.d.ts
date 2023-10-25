import Node from "./node";
import Streams from "./streams";
import User from "./user";
declare namespace DHT {
    enum Type {
        dhtAnnounce,
        dhtLookup,
        dhtBootstrap
    }
    enum Action {
        get,
        set,
        push
    }
    enum Request {
        announce,
        lookup,
        revoke
    }
    interface Main {
        type: DHT.Request;
        action: DHT.Action;
    }
    namespace LookUp {
        interface Request extends Main {
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
        interface Answer extends Main {
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
        interface Request extends Main {
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
        interface Request extends Main {
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
