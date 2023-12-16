import { Node } from "../../../../types";
export default function EditNode(params: Node.Model): Promise<{
    numAffected: number;
    affectedDocuments: import("@seald-io/nedb").Document<Node.Model> | import("@seald-io/nedb").Document<Node.Model>[] | null;
    upsert: boolean;
}>;
