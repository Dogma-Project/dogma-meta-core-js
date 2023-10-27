import * as Types from "../types";
import args from "./arguments";
import { DEFAULTS } from "../constants";

class Storage {
  // config: Types.Config.Params = {
  //   router: Number(args.port) || DEFAULTS.ROUTER,
  //   bootstrap: Types.Connection.Group.unknown,
  //   dhtLookup: Types.Connection.Group.unknown,
  //   dhtAnnounce: Types.Connection.Group.unknown,
  //   autoDefine: Types.Constants.Boolean.false,
  //   external: "",
  //   public_ipv4: "",
  // };

  users: Types.User.Model[] = [];
  nodes: Types.Node.Model[] = [];
  node: Types.Node.Storage = {
    id: null,
    name: DEFAULTS.NODE_NAME,
    privateKey: null,
    publicKey: null,
  };

  user: Types.User.Storage = {
    id: null,
    name: DEFAULTS.USER_NAME,
    privateKey: null,
    publicKey: null,
  };
}

export default Storage;
