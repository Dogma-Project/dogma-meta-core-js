import { System } from "./system";
export declare namespace Event {
    enum Action {
        update = 0,
        set = 1
    }
    type Payload = any[];
    namespace Type {
        type ConfigStr = Type.configExternal | Type.configPublicIpV4;
        type ConfigBool = Type.configAutoDefine | Type.configLocalDiscovery;
        type ConfigNum = Type.configRouter | Type.configDhtAnnounce | Type.configDhtBootstrap | Type.configDhtLookup;
        type Config = ConfigStr | ConfigBool | ConfigNum;
        type Service = Type.masterKey | Type.nodeKey | Type.configDb | Type.nodesDb | Type.usersDb | Type.messagesDb | Type.dhtService | Type.dhtDb | Type.filesDb | Type.protocolDb | Type.syncDb | Type.server | Type.localDiscovery | Type.dirStatus | Type.storageUser | Type.storageNode;
        type Services = Type.services;
        type Storage = Type.nodes | Type.users | Type.prefix;
        type Action = Type.start | Type.online | Type.offline;
    }
    type ServicesList = {
        service: Type.Service;
        state: System.States;
    }[];
    enum Type {
        start = "START",
        online = "ONLINE",
        offline = "OFFLINE",
        nodes = "NODES",
        users = "USERS",
        prefix = "PREFIX",
        services = "SERVICES",
        masterKey = "MASTER KEY",
        nodeKey = "NODE KEY",
        configDb = "CONFIG DB",
        nodesDb = "NODES DB",
        usersDb = "USERS DB",
        messagesDb = "MESSAGES DB",
        dhtService = "DHT SERVICE",
        dhtDb = "DHT DB",
        filesDb = "FILES DB",
        protocolDb = "PROTOCOL DB",
        syncDb = "SYNC DB",
        server = "SERVER",
        localDiscovery = "LOCAL DISCOVERY",
        dirStatus = "HOME DIR",
        storageUser = "STORAGE USER",
        storageNode = "STORAGE NODE",
        configRouter = "CONFIG ROUTER",
        configDhtLookup = "CONFIG DHT LOOKUP",
        configDhtAnnounce = "CONFIG DHT ANNOUNCE",
        configDhtBootstrap = "CONFIG DHT BOOTSTRAP",
        configAutoDefine = "CONFIG AUTO DEFINE",
        configExternal = "CONFIG EXTERNAL",
        configPublicIpV4 = "CONFIG PUBLIC IPV4",
        configLocalDiscovery = "CONFIG LOCAL DISCOVERY"
    }
}
