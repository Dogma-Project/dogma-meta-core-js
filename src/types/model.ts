import { C_Sync } from "./constants";
import {
  ConfigModel,
  NodeModel,
  DHTModel,
  UserModel,
  MessageModel,
  ProtocolModel,
  FileModel,
} from "../modules/model";

export namespace Model {
  export type All = {
    [C_Sync.Type.users]?: UserModel;
    [C_Sync.Type.nodes]?: NodeModel;
    [C_Sync.Type.messages]?: MessageModel;
  };
}
