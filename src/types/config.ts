// import Connection from "./connection";
import Constants from "./constants";

declare namespace Config {
  export type Model = {
    [key: string]: string | number | Constants.Boolean;
  };
  // export interface Params {
  //   [index: string]: any;
  //   router: number;
  //   bootstrap: Connection.Group;
  //   dhtLookup: Connection.Group;
  //   dhtAnnounce: Connection.Group;
  //   external: string;
  //   autoDefine: Constants.Boolean;
  //   public_ipv4: string;
  //   stun?: number; // edit
  //   turn?: number; // edit
  // }
}

export default Config;
