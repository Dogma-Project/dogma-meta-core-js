import { Node } from "./node";
import { User } from "./user";

export namespace Certificate {
  export type ExportFormat = {
    /**
     * HEX-encoded public PEM key
     */
    key: string;
    user: User.ExportModel;
    node: Node.ExportModel;
  };
}
