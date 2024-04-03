import { System } from "./system";

export const Defaults = {
  router: 24601,
  prodManagerPort: 25601,
  devManagerPort: 25602,
  minApiPort: 26000,
  maxApiPort: 26999,
  devApiPort: 26001,
  localDiscoveryPort: 27601,
  logLevel: System.LogLevel.info,
  external:
    "http://ifconfig.io/ip \nhttp://whatismyip.akamai.com/ \nhttp://ipv4bot.whatismyipaddress.com \nhttp://api.ipify.org \nhttp://trackip.net/ip \nhttp://diagnostic.opendns.com/myip",
  autoDefineIp: true,
  localDiscovery: true,
  friendshipRequests: true,
  userName: "Dogma User",
  nodeName: "Dogma Node",
} as const;
