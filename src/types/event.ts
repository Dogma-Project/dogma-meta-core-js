declare namespace Event {
  export enum Action {
    update,
    set,
  }
  export type Payload = any;
  export enum Type {
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
