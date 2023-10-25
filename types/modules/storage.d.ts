import * as Types from "../types";
declare class Storage {
    constructor();
    config: Types.Config.Params;
    users: Types.User.Model[];
    nodes: Types.Node.Model[];
    node: Types.Node.Storage;
    user: Types.User.Storage;
}
export default Storage;
