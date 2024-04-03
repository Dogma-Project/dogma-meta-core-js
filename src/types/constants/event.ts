export namespace Event {
  export const enum Action {
    update = 0,
    set = 1,
  }

  export const enum Type {
    start = "START", // action
    ready = "READY", // action

    online = "ONLINE", // action
    offline = "OFFLINE", // action
    friendshipRequest = "FRIENDSHIP REQUEST", // action
    sync = "SYNC", // action

    encryptionKey = "ENCRYPTION KEY", // storage
    services = "SERVICES",

    userKey = "USER KEY", // service
    nodeKey = "NODE KEY", // service
    configDb = "CONFIG DB", // service
    nodesDb = "NODES DB", // service
    usersDb = "USERS DB", // service
    messagesDb = "MESSAGES DB", // service
    dhtService = "DHT SERVICE", // service
    dhtDb = "DHT DB", // service
    filesDb = "FILES DB", // service
    protocolDb = "PROTOCOL DB", // service
    syncDb = "SYNC DB", // service
    server = "SERVER", // service
    localDiscovery = "LOCAL DISCOVERY", // service
    dirStatus = "HOME DIR", // service
    storageUser = "STORAGE USER", // service
    storageNode = "STORAGE NODE", // service

    configRouter = "CONFIG ROUTER", // config
    configDhtLookup = "CONFIG DHT LOOKUP", // config
    configDhtAnnounce = "CONFIG DHT ANNOUNCE", // config
    configDhtBootstrap = "CONFIG DHT BOOTSTRAP", // config
    configAutoDefine = "CONFIG AUTO DEFINE", // config
    configExternal = "CONFIG EXTERNAL", // config
    configPublicIpV4 = "CONFIG PUBLIC IPV4", // config
    configLocalDiscovery = "CONFIG LOCAL DISCOVERY", // config
    configFriendshipRequests = "CONFIG FRIENDSHIP REQUESTS", // config
  }

  export namespace Type {
    export type ConfigStr = Type.configExternal | Type.configPublicIpV4;
    export type ConfigBool =
      | Type.configAutoDefine
      | Type.configLocalDiscovery
      | Type.configFriendshipRequests;
    export type ConfigNum =
      | Type.configRouter
      | Type.configDhtAnnounce
      | Type.configDhtBootstrap
      | Type.configDhtLookup;
    export type Config = ConfigStr | ConfigBool | ConfigNum;
    export type Service =
      | Type.userKey
      | Type.nodeKey
      | Type.configDb
      | Type.nodesDb
      | Type.usersDb
      | Type.messagesDb
      | Type.dhtService
      | Type.dhtDb
      | Type.filesDb
      | Type.protocolDb
      | Type.syncDb
      | Type.server
      | Type.localDiscovery
      | Type.dirStatus
      | Type.storageUser
      | Type.storageNode;
    export type Services = Type.services;
    export type Storage = Type.encryptionKey;
    export type Action =
      | Type.start
      | Type.ready
      | Type.online
      | Type.offline
      | Type.friendshipRequest;
  }
}
