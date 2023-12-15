import { Node } from "../types";
import { User } from "./user";

export namespace Keys {
  export type InitialParams = {
    name: string; // check
    keylength: 1024 | 2048 | 4096;
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
}
