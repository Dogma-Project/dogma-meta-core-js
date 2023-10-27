declare namespace Event {
  export const enum Action {
    update,
    set,
  }
  export type Payload = any;
  export const enum Type {
    start,
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
    dhtDb,
    filesDb,
    protocolDb,
    syncDb,
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
    dataDht,
  }
  export type Listenter = (
    action: Action,
    payload: Payload,
    type: Type
  ) => void;
  export type ArrayOfListeners = [Type[], Listenter] | [];
}

export default Event;
