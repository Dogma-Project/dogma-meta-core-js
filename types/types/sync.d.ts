import { C_Streams, C_Sync } from "@dogma-project/constants-meta";
export declare namespace Sync {
    type Id = string;
    type Result = {
        [index in C_Sync.Type]?: object[];
    };
    interface RequestFull {
        action: C_Sync.Action.get;
        /**
         * Get all data from timestamp
         */
        from: number;
        time: number;
    }
    interface RequestPartial extends RequestFull {
        type: C_Sync.Type;
    }
    type Request = RequestFull | RequestPartial;
    interface ResponseFull {
        action: C_Sync.Action.push;
        /**
         * Array of db records
         */
        payload: Result;
        time: number;
    }
    interface ResponsePartial extends ResponseFull {
        type: C_Sync.Type;
    }
    type Response = ResponseFull | ResponsePartial;
    interface Notify {
        action: C_Sync.Action.notify;
        type: C_Sync.Type;
        time: number;
    }
    type Data = Request | Response | Notify;
    type Abstract = {
        class: C_Streams.MX.sync;
        body: Data;
    };
}
