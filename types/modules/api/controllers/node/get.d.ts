import { Node, User } from "../../../../types";
/**
 * If user_id and node_id not defined, returns own node
 * @param params
 */
export default function GetNode(params: {
    user_id?: User.Id;
    node_id?: Node.Id;
}): Promise<Node.Model>;
