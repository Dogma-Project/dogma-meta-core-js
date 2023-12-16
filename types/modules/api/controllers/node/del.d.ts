import { Node, User } from "../../../../types";
/**
 * If user_id and node_id not defined, returns own node
 * @todo can't delete own node
 * @param params
 */
export default function DeleteNode(params: {
    user_id: User.Id;
    node_id: Node.Id;
}): Promise<{
    numAffected: number;
    affectedDocuments: import("@seald-io/nedb").Document<Node.Model> | import("@seald-io/nedb").Document<Node.Model>[] | null;
    upsert: boolean;
}>;
