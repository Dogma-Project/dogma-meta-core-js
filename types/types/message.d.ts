import { C_Streams, C_Connection, C_Message } from "@dogma-project/constants-meta";
export declare namespace Message {
    type Model = {
        id: string;
        sync_id: string;
        text: string;
        direction: C_Connection.Direction;
        format: number;
        type: C_Message.Type;
    };
    namespace Send {
        interface Request {
            type: C_Message.Type;
            action: C_Message.Action.send;
            data: Request.Data;
        }
        namespace Request {
            type Data = {};
        }
    }
    namespace Delete {
        interface Request {
            type: C_Message.Type;
            action: C_Message.Action.delete;
            data: Request.Data;
        }
        namespace Request {
            type Data = {};
        }
    }
    type Requests = Send.Request | Delete.Request;
    type Abstract = {
        class: C_Streams.MX.messages;
        body: Requests;
    };
}
