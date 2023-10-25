import Connection from "./connection";
import Streams from "./streams";
declare namespace Message {
    enum Type {
        direct,
        user,
        chat
    }
    enum Action {
        send,
        sync,
        edit,
        delete
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
