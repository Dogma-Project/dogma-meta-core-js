export const Event = {
  Action: {
    update: 0,
    set: 1,
  },

  Type: {
    start: "START", // action
    ready: "READY", // action

    online: "ONLINE", // action
    offline: "OFFLINE", // action
    friendshipRequest: "FRIENDSHIP REQUEST", // action
    sync: "SYNC", // action

    encryptionKey: "ENCRYPTION KEY", // storage
    services: "SERVICES",

    userKey: "USER KEY", // service
    nodeKey: "NODE KEY", // service
    configDb: "CONFIG DB", // service
    nodesDb: "NODES DB", // service
    usersDb: "USERS DB", // service
    messagesDb: "MESSAGES DB", // service
    dhtService: "DHT SERVICE", // service
    dhtDb: "DHT DB", // service
    filesDb: "FILES DB", // service
    protocolDb: "PROTOCOL DB", // service
    syncDb: "SYNC DB", // service
    server: "SERVER", // service
    localDiscovery: "LOCAL DISCOVERY", // service
    dirStatus: "HOME DIR", // service
    storageUser: "STORAGE USER", // service
    storageNode: "STORAGE NODE", // service

    configRouter: "CONFIG ROUTER", // config
    configDhtLookup: "CONFIG DHT LOOKUP", // config
    configDhtAnnounce: "CONFIG DHT ANNOUNCE", // config
    configDhtBootstrap: "CONFIG DHT BOOTSTRAP", // config
    configAutoDefine: "CONFIG AUTO DEFINE", // config
    configExternal: "CONFIG EXTERNAL", // config
    configPublicIpV4: "CONFIG PUBLIC IPV4", // config
    configLocalDiscovery: "CONFIG LOCAL DISCOVERY", // config
    configFriendshipRequests: "CONFIG FRIENDSHIP REQUESTS", // config
  },
} as const;
