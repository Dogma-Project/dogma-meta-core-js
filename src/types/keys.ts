import { Node } from "../types";
import { User } from "./user";
import { C_Keys } from "../constants";
import { ValuesOf } from "./_main";

export namespace Keys {
  export type Length = 1024 | 2048 | 4096;

  export type Types = ValuesOf<typeof C_Keys.Type>;

  export type InitialParams = {
    name: string;
    keylength: Length;
    seed?: string;
  };

  export type ExportFormat = {
    /**
     * HEX-encoded private PEM key
     */
    key: string;
    user: User.Model;
    nodes: Node.Model[];
  };

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

  export type Import = { path: string } | { b64: string };
}
