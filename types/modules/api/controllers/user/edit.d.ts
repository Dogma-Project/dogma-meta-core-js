import { User } from "../../../../types";
export default function EditUser(params: User.Model): Promise<{
    numAffected: number;
    affectedDocuments: import("@seald-io/nedb").Document<User.Model> | import("@seald-io/nedb").Document<User.Model>[] | null;
    upsert: boolean;
}>;
