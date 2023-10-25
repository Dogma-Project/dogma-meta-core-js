import Connection from "./connection";
import Constants from "./constants";

declare namespace Config {
  export type Model = {
    [index: string]: string | number; // edit
  };
  export interface Params {
    _router: number;
    router: number;
    bootstrap: Connection.Group;
    dhtLookup: Connection.Group;
    dhtAnnounce: Connection.Group;
    external: string;
    autoDefine: Constants.Boolean;
    public_ipv4: string;
    stun?: number; // edit
    turn?: number; // edit
  }
}

export default Config;
