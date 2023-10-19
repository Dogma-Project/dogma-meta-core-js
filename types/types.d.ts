/// <reference types="node" />
/// <reference types="node" />
import EncodeStream from "./libs/streams/encode";
import net from "node:net";
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
            sync_id?: Sync.Id;
        };
    }
    namespace User {
        type Id = string;
        type Model = {
            user_id: User.Id;
            name: string;
            avatar?: string;
            sync_id?: Sync.Id;
        };
    }
    namespace Config {
        type Model = {
            [index: string]: string | number;
        };
        type Params = {
            router: number;
            bootstrap: Constants.DhtPermission;
            dhtLookup: Constants.DhtPermission;
            dhtAnnounce: Constants.DhtPermission;
            external: string;
            autoDefine: Constants.Boolean;
            public_ipv4: string;
            stun?: number;
            turn?: number;
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
        type Id = string;
        interface Description {
            connection_id: Id;
            address: string;
            user_id: User.Id;
            node_id: Node.Id;
            status: number;
        }
        interface Multiplex {
            control: EncodeStream;
            messages: EncodeStream;
            files: EncodeStream;
            dht: EncodeStream;
        }
        interface Socket extends net.Socket {
            dogma: Description;
            multiplex: Multiplex;
        }
        type SocketArray = {
            [index: string]: Socket;
        };
        type Peer = {
            host: string;
            port: number;
            public?: boolean;
            version?: 4 | 6;
        };
    }
    namespace Certificate {
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
    type Store = {
        config: Config.Params;
        ca: any[];
        users: any[];
        nodes: any[];
        node: {
            name: string;
            id: Node.Id;
            key: Buffer | null;
            cert: Buffer | null;
            public_ipv4: string;
        };
        user: {
            name: string;
            id: Node.Id;
            key: Buffer | null;
            cert: Buffer | null;
        };
    };
    namespace Key {
        type InitialParams = {
            name: string;
            keylength: 1024 | 2048 | 4096;
            seed?: string;
        };
    }
    namespace Constants {
        type Boolean = 0 | 1;
        type DhtPermission = 0 | 1 | 2 | 3;
        type MessagesType = 0 | 1 | 2;
    }
    namespace File {
        type Description = {
            descriptor: number;
            size: number;
            pathname: string;
            data?: string;
        };
    }
    namespace Response {
        type Main = {
            id: number | string;
            code: number;
            message?: string;
        };
    }
    namespace Message {
        namespace Class {
            interface Base {
                id: number;
            }
            export interface TextMessage extends Base {
                text: string;
            }
            export interface FilesMessage extends Base {
                files: Message.File[];
                text?: string;
            }
            export interface StickerMessage extends Base {
                sticker: any;
            }
            export type Abstract = TextMessage | FilesMessage | StickerMessage;
            export {};
        }
        type FileShare = {
            name: string;
            size: number;
            type: number;
            pathname: string;
        };
        type FileEncoded = {
            name: string;
            size: number;
            type: number;
            data: string;
        };
        type File = FileShare | FileEncoded;
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
