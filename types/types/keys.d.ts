import { Node } from "../types";
import { User } from "./user";
export declare namespace Keys {
    type InitialParams = {
        name: string;
        keylength: 1024 | 2048 | 4096;
        seed?: string;
    };
    type ExportFormat = {
        /**
         * HEX-encoded private PEM key
         */
        key: string;
        user: User.Model;
        nodes: Node.Model[];
    };
}
