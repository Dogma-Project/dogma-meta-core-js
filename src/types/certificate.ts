import { Node } from "./node";
import { User } from "./user";

export namespace Certificate {
  export type ExportFormat = {
    user_id: User.Id;
    node?: Node.ExportModel;
  };
}
