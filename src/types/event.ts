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
    updateUser = "UPDATE USER",
    sendRequest = "SEND REQUEST",

    dataDummy = "DATA DUMMY", // stream
    dataControl = "DATA CONTROL", // stream
    dataMessages = "DATA MESSAGES", // stream
    dataMail = "DATA MAIL", // stream
    dataDht = "DATA DHT", // stream

    nodes = "NODES", // storage
    users = "USERS", // storage

    services = "SERVICES",
    masterKey = "MASTER KEY", // service
    nodeKey = "NODE KEY", // service
    configDb = "CONFIG DB", // service
    nodesDb = "NODES DB", // service
    usersDb = "USERS DB", // service
    messagesDb = "MESSAGES DB", // service
    dhtDb = "DHT DB",
    filesDb = "FILES DB",
    protocolDb = "PROTOCOL DB",
    syncDb = "SYNC DB",
    server = "SERVER", // service
    localDiscovery = "LOCAL DISCOVERY", // service
    homeDir = "HOME DIR", // service
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
