import { C_Sync } from "@dogma-project/constants-meta";
import { NodeModel, UserModel, MessageModel } from "../modules/model";
export declare namespace Model {
    type All = {
        [C_Sync.Type.users]?: UserModel;
        [C_Sync.Type.nodes]?: NodeModel;
        [C_Sync.Type.messages]?: MessageModel;
    };
}
