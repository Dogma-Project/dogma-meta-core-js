declare namespace Event {
    const enum Action {
        update = 0,
        set = 1
    }
    type Payload = any[];
    const enum Type {
        start = "START",
        online = "ONLINE",
        offline = "OFFLINE",
        externalPort = "EXTERNAL PORT",
        updateUser = "UPDATE USER",
        sendRequest = "SEND REQUEST",
        dataDummy = "DATA DUMMY",
        dataControl = "DATA CONTROL",
        dataMessages = "DATA MESSAGES",
        dataMail = "DATA MAIL",
        dataDht = "DATA DHT",
        nodes = "NODES",
        users = "USERS",
        services = "SERVICES",
        masterKey = "MASTER KEY",
        nodeKey = "NODE KEY",
        configDb = "CONFIG DB",
        nodesDb = "NODES DB",
        usersDb = "USERS DB",
        messagesDb = "MESSAGES DB",
        dhtDb = "DHT DB",
        filesDb = "FILES DB",
        protocolDb = "PROTOCOL DB",
        syncDb = "SYNC DB",
        server = "SERVER",
        localDiscovery = "LOCAL DISCOVERY",
        homeDir = "HOME DIR",
        storageUser = "STORAGE USER",
        storageNode = "STORAGE NODE",
        configRouter = "CONFIG ROUTER",
        configDhtLookup = "CONFIG DHT LOOKUP",
        configDhtAnnounce = "CONFIG DHT ANNOUNCE",
        configDhtBootstrap = "CONFIG DHT BOOTSTRAP",
        configAutoDefine = "CONFIG AUTO DEFINE",
        configExternal = "CONFIG EXTERNAL",
        configPublicIpV4 = "CONFIG PUBLIC IPV4"
    }
    type Listenter = (payload: Payload, type?: Type, action?: Action) => void;
    type ArrayOfListeners = [Type[], Listenter] | [];
}
export default Event;
