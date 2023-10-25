declare namespace Event {
    enum Action {
        update,
        set
    }
    type Payload = any;
    enum Type {
        online,
        offline,
        nodes,
        users,
        masterKey,
        nodeKey,
        configDb,
        nodesDb,
        usersDb,
        messagesDb,
        protocolDb,
        configRouter,
        configDhtLookup,
        configDhtAnnounce,
        configDhtBootstrap,
        configAutoDefine,
        configExternal,
        configPublicIpV4,
        externalPort,
        server,
        updateUser,
        sendRequest,
        dataDummy,
        dataControl,
        dataMessages,
        dataMail,
        dataDht
    }
    type Listenter = (action: Action, payload: Payload, type: Type) => void;
    type ArrayOfListeners = [Type[], Listenter] | [];
}
export default Event;
