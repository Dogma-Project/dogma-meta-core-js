import { Types } from "../types";
declare const model: {
    getAll(): Promise<Record<string, any>[]>;
    get(db: string, node_id: Types.Node.Id): Promise<Record<string, any>>;
    confirm(db: string, node_id: Types.Node.Id): Promise<{
        numAffected: number;
        affectedDocuments: import("@seald-io/nedb").Document<Record<string, any>> | import("@seald-io/nedb").Document<Record<string, any>>[] | null;
        upsert: boolean;
    }>;
};
export default model;
