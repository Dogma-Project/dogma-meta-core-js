"use strict";
/** @module Constants */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ATTACHMENTS = exports.DESCRIPTOR = exports.MSG_CODE = exports.MSG_FORMAT = exports.DIRECTION = exports.MESSAGES = exports.PROTOCOL = exports.LOGLEVEL = exports.DEFAULTS = exports.STATES = exports.DHTPERM = exports.MX = exports.API = void 0;
/**
 * @constant
 * @type {Object}
 * @default see sources
 */
exports.API = {
    OK: 1,
    CANNOTGETCERT: 1001,
    INVALIDCERT: 1002,
    ADDCERTERROR: 1003,
    CREATEDBERROR: 1004,
    GETCONFIGERROR: 1005,
    CONFIGSAVEERROR: 1006,
    CANNOTGETMSG: 1007,
    CANNOTPUSHMSG: 1008,
    CANNOTGETFRIENDS: 1009,
    CANNOTCREATEMK: 1010,
    CANNOTCREATENK: 1011,
    CANNOTGETSERVICES: 1012,
    CANNOTGETCONNECTIONS: 1013,
    CANNOTDELETEFRIEND: 1014,
    CANNOTDELETEITSELF: 1015,
};
/**
 * @constant
 * @type {Object}
 * @default
 */
exports.MX = {
    CONTROL: 0,
    MESSAGES: 1,
    FILES: 2,
    FILES_DATA: 3,
    DHT: 4,
    ATTACHMENTS: 5,
    HANDSHAKE: 6,
    TEST: 7,
    MAIL: 8,
};
/**
 * @constant
 * @type {Object}
 * @default
 */
exports.DHTPERM = {
    NOBODY: 0,
    ONLY_OWN: 1,
    ONLY_FRIENDS: 2,
    ALL: 3,
};
/**
 * @constant
 * @type {Object}
 * @default
 */
exports.STATES = {
    ERROR: -1,
    DISABLED: 0,
    READY: 1,
    EMPTRY: 2,
    RELOAD: 6,
    LIMITED: 8,
    OK: 9,
    FULL: 10,
};
/**
 * @constant
 * @type {Object}
 * @default
 */
exports.DEFAULTS = {
    UNKNOWN: 0,
    ROUTER: 24601,
    LOG_LEVEL: 5,
    EXTERNAL: "http://ifconfig.io/ip \nhttp://whatismyip.akamai.com/ \nhttp://ipv4bot.whatismyipaddress.com \nhttp://api.ipify.org \nhttp://trackip.net/ip \nhttp://diagnostic.opendns.com/myip",
    AUTO_DEFINE_IP: 1,
    USER_NAME: "Dogma User",
    NODE_NAME: "Dogma Node",
    LOCAL_DISCOVERY_PORT: 45432,
};
/**
 * @constant
 * @type {Object}
 * @default
 */
exports.LOGLEVEL = {
    NOTHING: 0,
    ERRORS: 1,
    DEBUG: 2,
    INFO: 3,
    WARNINGS: 4,
    LOGS: 5,
};
/**
 * @constant
 * @type {Object}
 * @default
 */
exports.PROTOCOL = {
    DB: 1,
    CERTIFICATE: 0,
};
/**
 * @constant
 * @type {Object}
 * @default
 */
exports.MESSAGES = {
    DIRECT: 0,
    USER: 1,
    CHAT: 2,
};
exports.DIRECTION = {
    OUTCOMING: 0,
    INCOMING: 1,
};
exports.MSG_FORMAT = {
    DEFAULT: 0,
    FILES: 1,
    ATTACHMENTS: 2,
    COMMON: 3,
};
exports.MSG_CODE = {
    ERROR: -1,
    UNKNOWN: 0,
    SUCCESS: 1,
    CONFIRMED: 2,
};
exports.DESCRIPTOR = {
    SIZE: 15,
};
exports.ATTACHMENTS = {
    FILE: 0,
    IMAGE: 1,
    GIF: 2,
    AUDIO: 3,
    VIDEO: 4,
    VOICE: 5,
    VIDEO_MSG: 6,
};
