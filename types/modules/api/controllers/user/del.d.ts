import { User } from "../../../../types";
/**
 *
 * @param params
 */
export default function DeleteNode(params: {
    user_id: User.Id;
}): Promise<{
    numAffected: number;
    affectedDocuments: import("@seald-io/nedb").Document<User.Model> | import("@seald-io/nedb").Document<User.Model>[] | null;
    upsert: boolean;
}>;
