import { Node } from "./node";
import { User } from "./user";
export declare namespace Certificate {
    namespace Validation {
        type Result = {
            result: number;
            error: any;
            user_id: User.Id;
            name: string;
            cert: string;
            node: {
                node_id: Node.Id;
                name: string;
                public_ipv4: string;
                port: number;
            };
            own: boolean;
        };
    }
}
