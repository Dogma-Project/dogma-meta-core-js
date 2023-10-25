declare namespace Event {
    const enum Action {
        update = 0,
        set = 1
    }
    type Payload = any;
    const enum Type {
        online = 0,
        offline = 1,
        nodes = 2,
        users = 3,
        masterKey = 4,
        nodeKey = 5,
        configDb = 6,
        nodesDb = 7,
        usersDb = 8,
        messagesDb = 9,
        dhtDb = 10,
        protocolDb = 11,
        configRouter = 12,
        configDhtLookup = 13,
        configDhtAnnounce = 14,
        configDhtBootstrap = 15,
        configAutoDefine = 16,
        configExternal = 17,
        configPublicIpV4 = 18,
        externalPort = 19,
        server = 20,
        updateUser = 21,
        sendRequest = 22,
        dataDummy = 23,
        dataControl = 24,
        dataMessages = 25,
        dataMail = 26,
        dataDht = 27
    }
    type Listenter = (action: Action, payload: Payload, type: Type) => void;
    type ArrayOfListeners = [Type[], Listenter] | [];
}
export default Event;
