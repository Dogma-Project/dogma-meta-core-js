import { Node, User } from "../../../../types";
/**
 *
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
