/** @module Constants */
/**
 * @constant
 * @type {Object}
 * @default see sources
 */
export declare const API: {
    OK: number;
    CANNOTGETCERT: number;
    INVALIDCERT: number;
    ADDCERTERROR: number;
    CREATEDBERROR: number;
    GETCONFIGERROR: number;
    CONFIGSAVEERROR: number;
    CANNOTGETMSG: number;
    CANNOTPUSHMSG: number;
    CANNOTGETFRIENDS: number;
    CANNOTCREATEMK: number;
    CANNOTCREATENK: number;
    CANNOTGETSERVICES: number;
    CANNOTGETCONNECTIONS: number;
    CANNOTDELETEFRIEND: number;
    CANNOTDELETEITSELF: number;
};
/**
 * @constant
 * @type {Object}
 * @default
 */
export declare const MX: {
    CONTROL: number;
    MESSAGES: number;
    FILES: number;
    FILES_DATA: number;
    DHT: number;
    ATTACHMENTS: number;
    HANDSHAKE: number;
    TEST: number;
    MAIL: number;
};
/**
 * @constant
 * @type {Object}
 * @default
 */
export declare const DHTPERM: {
    NOBODY: number;
    ONLY_OWN: number;
    ONLY_FRIENDS: number;
    ALL: number;
};
/**
 * @constant
 * @type {Object}
 * @default
 */
export declare const STATES: {
    ERROR: number;
    DISABLED: number;
    READY: number;
    EMPTRY: number;
    RELOAD: number;
    LIMITED: number;
    OK: number;
    FULL: number;
};
/**
 * @constant
 * @type {Object}
 * @default
 */
export declare const DEFAULTS: {
    UNKNOWN: number;
    ROUTER: number;
    LOG_LEVEL: number;
    EXTERNAL: string;
    AUTO_DEFINE_IP: number;
    USER_NAME: string;
    NODE_NAME: string;
    LOCAL_DISCOVERY_PORT: number;
};
/**
 * @constant
 * @type {Object}
 * @default
 */
export declare const LOGLEVEL: {
    NOTHING: number;
    ERRORS: number;
    DEBUG: number;
    INFO: number;
    WARNINGS: number;
    LOGS: number;
};
/**
 * @constant
 * @type {Object}
 * @default
 */
export declare const PROTOCOL: {
    DB: number;
    CERTIFICATE: number;
};
/**
 * @constant
 * @type {Object}
 * @default
 */
export declare const MESSAGES: {
    DIRECT: number;
    USER: number;
    CHAT: number;
};
export declare const DIRECTION: {
    OUTCOMING: number;
    INCOMING: number;
};
export declare const MSG_FORMAT: {
    DEFAULT: number;
    FILES: number;
    ATTACHMENTS: number;
    COMON: number;
};
export declare const MSG_CODE: {
    ERROR: number;
    UNKNOWN: number;
    SUCCESS: number;
    CONFIRMED: number;
};
export declare const DESCRIPTOR: {
    SIZE: number;
};
export declare const ATTACHMENTS: {
    FILE: number;
    IMAGE: number;
    GIF: number;
    AUDIO: number;
    VIDEO: number;
    VOICE: number;
    VIDEO_MSG: number;
};
