export namespace Event {
  export enum Action {
    update = 0,
    set = 1,
  }
  export type Payload = any[];

  export enum Type {
    start = "START", // init event

    online = "ONLINE",
    offline = "OFFLINE",
    externalPort = "EXTERNAL PORT",
    sendRequest = "SEND REQUEST",

    nodes = "NODES", // storage
    users = "USERS", // storage
    prefix = "PREFIX", // storage

    services = "SERVICES",
    masterKey = "MASTER KEY", // service
    nodeKey = "NODE KEY", // service
    configDb = "CONFIG DB", // service
    nodesDb = "NODES DB", // service
    usersDb = "USERS DB", // service
    messagesDb = "MESSAGES DB", // service
    dhtService = "DHT SERVICE", // service
    dhtDb = "DHT DB",
    filesDb = "FILES DB",
    protocolDb = "PROTOCOL DB",
    syncDb = "SYNC DB",
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
  }

  export type Listenter = (
    payload: Payload,
    type?: Type,
    action?: Action
  ) => void;

  export type ArrayOfListeners = [Type[], Listenter] | [];
}
