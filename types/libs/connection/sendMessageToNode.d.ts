import { Types } from "../../types";
import ConnectionClass from "../connection";
export default function send(this: ConnectionClass, node_id: Types.Node.Id, message: Types.Message.Class.Abstract, type?: number): Promise<Types.Response.Main>;
