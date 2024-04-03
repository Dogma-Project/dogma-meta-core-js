import { C_System, C_Event } from "../constants";
import { ValuesOf } from "./_main";

export namespace Event {
  export type Payload = any[];

  export type ServiceState = ValuesOf<typeof C_System.States>;
  export type EventType = ValuesOf<typeof C_Event.Type>;

  export namespace Type {
    export type ConfigStr =
      | typeof C_Event.Type.configExternal
      | typeof C_Event.Type.configPublicIpV4;
    export type ConfigBool =
      | typeof C_Event.Type.configAutoDefine
      | typeof C_Event.Type.configLocalDiscovery
      | typeof C_Event.Type.configFriendshipRequests;
    export type ConfigNum =
      | typeof C_Event.Type.configRouter
      | typeof C_Event.Type.configDhtAnnounce
      | typeof C_Event.Type.configDhtBootstrap
      | typeof C_Event.Type.configDhtLookup;
    export type Config = ConfigStr | ConfigBool | ConfigNum;
    export type Service =
      | typeof C_Event.Type.userKey
      | typeof C_Event.Type.nodeKey
      | typeof C_Event.Type.configDb
      | typeof C_Event.Type.nodesDb
      | typeof C_Event.Type.usersDb
      | typeof C_Event.Type.messagesDb
      | typeof C_Event.Type.dhtService
      | typeof C_Event.Type.dhtDb
      | typeof C_Event.Type.filesDb
      | typeof C_Event.Type.protocolDb
      | typeof C_Event.Type.syncDb
      | typeof C_Event.Type.server
      | typeof C_Event.Type.localDiscovery
      | typeof C_Event.Type.dirStatus
      | typeof C_Event.Type.storageUser
      | typeof C_Event.Type.storageNode;
    export type Services = typeof C_Event.Type.services;
    export type Storage = typeof C_Event.Type.encryptionKey;
    export type Action =
      | typeof C_Event.Type.start
      | typeof C_Event.Type.ready
      | typeof C_Event.Type.online
      | typeof C_Event.Type.offline
      | typeof C_Event.Type.friendshipRequest;
  }

  export type Types = ValuesOf<typeof C_Event.Type>;
  export type Actions = ValuesOf<typeof C_Event.Action>;

  export type ServicesList = {
    service: Type.Service;
    state: ServiceState;
  }[];
}
