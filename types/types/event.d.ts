declare namespace Event {
    const enum Action {
        update = 0,
        set = 1
    }
    type Payload = any;
    const enum Type {
        start = "START",
        online = "ONLINE",
        offline = "OFFLINE",
        nodes = "NODES",
        users = "USERS",
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
        configRouter = "CONFIG ROUTER",
        configDhtLookup = "CONFIG DHT LOOKUP",
        configDhtAnnounce = "CONFIG DHT ANNOUNCE",
        configDhtBootstrap = "CONFIG DHT BOOTSTRAP",
        configAutoDefine = "CONFIG AUTO DEFINE",
        configExternal = "CONFIG EXTERNAL",
        configPublicIpV4 = "CONFIG PUBLIC IPV4",
        externalPort = "EXTERNAL PORT",
        server = "SERVER",
        updateUser = "UPDATE USER",
        sendRequest = "SEND REQUEST",
        dataDummy = "DATA DUMMY",
        dataControl = "DATA CONTROL",
        dataMessages = "DATA MESSAGES",
        dataMail = "DATA MAIL",
        dataDht = "DATA DHT",
        homeDir = "HOME DIR"
    }
    type Listenter = (action: Action, payload: Payload, type: Type) => void;
    type ArrayOfListeners = [Type[], Listenter] | [];
}
export default Event;
