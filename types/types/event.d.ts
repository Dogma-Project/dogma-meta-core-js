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
        protocolDb = 12,
        configRouter = 13,
        configDhtLookup = 14,
        configDhtAnnounce = 15,
        configDhtBootstrap = 16,
        configAutoDefine = 17,
        configExternal = 18,
        configPublicIpV4 = 19,
        externalPort = 20,
        server = 21,
        updateUser = 22,
        sendRequest = 23,
        dataDummy = 24,
        dataControl = 25,
        dataMessages = 26,
        dataMail = 27,
        dataDht = 28
    }
    type Listenter = (action: Action, payload: Payload, type: Type) => void;
    type ArrayOfListeners = [Type[], Listenter] | [];
}
export default Event;
