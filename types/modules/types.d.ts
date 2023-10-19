/// <reference types="node" />
import tls from "node:tls";
export declare namespace Types {
    namespace Node {
        type Id = string;
        type Model = {
            node_id: Node.Id;
            user_id: User.Id;
            name: string;
            public_ipv4?: string;
            public_ipv6?: string;
            local_ipv4?: string;
            local_ipv6?: string;
            sync_id: Sync.Id;
        };
    }
    namespace User {
        type Id = string;
        type Model = {
            user_id: User.Id;
            name: string;
            avatar: string;
        };
    }
    namespace Sync {
        type Id = string;
    }
    namespace Discovery {
        type Card = {
            type: string;
            user_id: User.Id;
            node_id: Node.Id;
            port: number;
        };
    }
    namespace DHT {
        type Type = "dhtAnnounce" | "dhtBootstrap" | "dhtLookup";
        type Request = "announce" | "lookup" | "revoke";
        type Action = "get" | "set";
        namespace RequestData {
            interface Main {
                type: DHT.Request;
                action: DHT.Action;
                port: number;
            }
            export type LookupData = {
                user_id: User.Id;
                node_id?: Node.Id;
            };
            export type AnnounceData = {
                port: number;
            };
            export type LookupAnswerData = {
                user_id: User.Id;
                node_id: Node.Id;
                public_ipv4: string;
                port: number;
            };
            export interface Lookup extends Main {
                type: "lookup";
                action: "get";
                user_id: User.Id;
                node_id?: Node.Id;
            }
            export interface LookupAnswer extends Omit<Lookup, "action"> {
                action: "set";
                data: RequestData.LookupAnswerData;
            }
            export type Outgoing = AnnounceData | LookupData;
            export interface Announce extends Main {
                type: "announce";
                action: DHT.Action;
            }
            export interface Revoke extends Main {
                type: "revoke";
                action: DHT.Action;
            }
            export {};
        }
        type FromData = {
            user_id: User.Id;
            node_id: Node.Id;
            public_ipv4: string;
        };
        type CardQuery = {
            request: RequestData.Lookup | RequestData.Announce | RequestData.Revoke;
            from: FromData;
        };
        type CardAnswer = {
            request: RequestData.LookupAnswer;
            from: FromData;
        };
        type Card = CardQuery | CardAnswer;
    }
    namespace Connection {
        type Peer = {
            [index: string]: tls.TLSSocket;
        };
    }
}
declare global {
    interface String {
        toPlainHex(): string | null;
    }
    interface Array<T> {
        unique(): Array<T>;
    }
}
