import { Node } from "./node";
import { User } from "./user";

export namespace Certificate {
  export namespace Validation {
    export type Result = {
      result: number;
      error: any;
      user_id: User.Id;
      name: string;
      cert: string; // edit
      node: {
        node_id: Node.Id;
        name: string;
        public_ipv4: string;
        port: number;
      };
      own: boolean;
    };
  }
}
