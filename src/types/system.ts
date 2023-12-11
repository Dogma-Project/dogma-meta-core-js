import { IncomingMessage, ServerResponse } from "node:http";

export namespace System {
  export namespace API {
    export type Request = {
      path: string[];
      query: URLSearchParams;
      method: string;
    };
    export type Response = ServerResponse<IncomingMessage> & {
      req: IncomingMessage;
    };
  }
}
