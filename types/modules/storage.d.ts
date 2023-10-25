import * as Types from "../types";
declare class Storage {
    constructor();
    config: Types.Config.Params;
    users: Types.User.Model[];
    nodes: Types.Node.Model[];
    node: {
        name: string;
        key: null;
        cert: null;
        id: string;
        public_ipv4: string;
    };
    user: {
        name: string;
        key: null;
        cert: null;
        id: string;
    };
}
export default Storage;
