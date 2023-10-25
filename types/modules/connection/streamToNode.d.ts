import * as Types from "../../types";
import ConnectionClass from "../connection";
export default function stream(this: ConnectionClass, node_id: Types.Node.Id, descriptor: number): Promise<any>;
