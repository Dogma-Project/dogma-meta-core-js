export const API = {
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
export const DEFAULTS = {
  UNKNOWN: 0,
  ROUTER: 24601,
  LOG_LEVEL: 5,
  EXTERNAL:
    "http://ifconfig.io/ip \nhttp://whatismyip.akamai.com/ \nhttp://ipv4bot.whatismyipaddress.com \nhttp://api.ipify.org \nhttp://trackip.net/ip \nhttp://diagnostic.opendns.com/myip",
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
export const PROTOCOL = {
  DB: 1,
  CERTIFICATE: 0,
};

export const MSG_FORMAT = {
  DEFAULT: 0,
  FILES: 1,
  ATTACHMENTS: 2,
  COMMON: 3,
};

export const MSG_CODE = {
  ERROR: -1,
  UNKNOWN: 0,
  SUCCESS: 1,
  CONFIRMED: 2,
};

export const DESCRIPTOR = {
  SIZE: 15,
};

export const ATTACHMENTS = {
  FILE: 0,
  IMAGE: 1,
  GIF: 2,
  AUDIO: 3,
  VIDEO: 4,
  VOICE: 5,
  VIDEO_MSG: 6,
};

export const enum KEYS {
  TYPE = "pkcs1",
  FORMAT = "pem",
}
export const enum SIZES {
  MX = 1,
  LEN = 2,
}
