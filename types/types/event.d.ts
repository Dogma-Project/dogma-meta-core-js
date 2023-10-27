declare namespace Event {
    const enum Action {
        update = 0,
        set = 1
    }
    type Payload = any;
    const enum Type {
        start = 0,
        online = 1,
        offline = 2,
        nodes = 3,
        users = 4,
        masterKey = 5,
        nodeKey = 6,
        configDb = 7,
        nodesDb = 8,
        usersDb = 9,
        messagesDb = 10,
        dhtDb = 11,
        filesDb = 12,
        protocolDb = 13,
        syncDb = 14,
        configRouter = 15,
        configDhtLookup = 16,
        configDhtAnnounce = 17,
        configDhtBootstrap = 18,
        configAutoDefine = 19,
        configExternal = 20,
        configPublicIpV4 = 21,
        externalPort = 22,
        server = 23,
        updateUser = 24,
        sendRequest = 25,
        dataDummy = 26,
        dataControl = 27,
        dataMessages = 28,
        dataMail = 29,
        dataDht = 30,
        homeDir = 31
    }
    type Listenter = (action: Action, payload: Payload, type: Type) => void;
    type ArrayOfListeners = [Type[], Listenter] | [];
}
export default Event;
