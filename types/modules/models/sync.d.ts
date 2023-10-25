import * as Types from "../../types";
declare const model: {
    getAll(): Promise<any>;
    get(db: string, node_id: Types.Node.Id): Promise<any>;
    confirm(db: string, node_id: Types.Node.Id): Promise<any>;
};
export default model;
