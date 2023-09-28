export namespace certificate {
    function get(): Object;
    function set(): void;
    function push(cert: string): Object;
}
export namespace database {
    export function get_1(): void;
    export { get_1 as get };
    export function set_1(defaults: {
        router: number;
        bootstrap: number;
        dhtLookup: number;
        dhtAnnounce: number;
        external: string;
        autoDefine: number;
        public_ipv4: string;
        stun: number;
        turn: number;
    }): Object;
    export { set_1 as set };
}
export namespace config {
    export function get_2(): {
        code: number;
        data: any;
    };
    export { get_2 as get };
    export function set_2(data: Object): Object;
    export { set_2 as set };
}
export namespace messages {
    export function get_3(params: {
        id: string;
        since: number;
        type: number;
    }): any[];
    export { get_3 as get };
    export function push_1(data: {
        to: string;
        message: Object;
        type: number;
    }): Promise<{
        code: number;
        data: any;
    }>;
    export { push_1 as push };
}
export namespace friends {
    export function get_4(): Promise<{
        code: number;
        data: any;
    }>;
    export { get_4 as get };
    export function set_3(): void;
    export { set_3 as set };
    export function _delete(user_id: string): Promise<{
        code: number;
        data: any;
    }>;
    export { _delete as delete };
}
export namespace masterKey {
    export function get_5(): void;
    export { get_5 as get };
    export function set_4(params: Object): {
        code: number;
        data: any;
    };
    export { set_4 as set };
}
export namespace nodeKey {
    export function get_6(): void;
    export { get_6 as get };
    export function set_5(params: Object): {
        code: number;
        data: any;
    };
    export { set_5 as set };
}
export namespace services {
    export function get_7(): Object;
    export { get_7 as get };
    export function set_6(): void;
    export { set_6 as set };
}
export namespace files {
    export function get_8(params: Object): Promise<{
        code: number;
        data: any;
    }>;
    export { get_8 as get };
    export function push_2(data: Object): Object;
    export { push_2 as push };
    export function _delete_1(params: Object): void;
    export { _delete_1 as delete };
}
export namespace connections {
    export function get_9(): Promise<{
        code: number;
        data: any;
    }>;
    export { get_9 as get };
    export function _delete_2(id: string): void;
    export { _delete_2 as delete };
}
