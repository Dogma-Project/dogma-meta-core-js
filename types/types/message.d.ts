import Connection from "./connection";
import Streams from "./streams";
declare namespace Message {
    const enum Type {
        direct = 0,
        user = 1,
        chat = 2
    }
    const enum Action {
        send = 0,
        sync = 1,
        edit = 2,
        delete = 3
    }
    type Model = {
        id: string;
        sync_id: string;
        text: string;
        direction: Connection.Direction;
        format: number;
        type: Type;
    };
    namespace Send {
        interface Request {
            type: Type;
            action: Action.send;
            data: Request.Data;
        }
        namespace Request {
            type Data = {};
        }
    }
    namespace Delete {
        interface Request {
            type: Type;
            action: Action.delete;
            data: Request.Data;
        }
        namespace Request {
            type Data = {};
        }
    }
    type Requests = Send.Request | Delete.Request;
    type Abstract = {
        class: Streams.MX.messages;
        body: Requests;
    };
}
export default Message;
