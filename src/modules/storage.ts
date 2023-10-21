import { Types } from "../types";
import args from "./arguments";
import { DEFAULTS } from "../constants";

class Storage {
  constructor() {}

  config: Types.Config.Params = {
    _router: 0,
    get router() {
      return Number(args.port) || this._router || DEFAULTS.ROUTER;
    },
    set router(port: number) {
      this._router = Number(args.port) || port; // edit // check order
    },
    bootstrap: Types.Connection.Group.unknown,
    dhtLookup: Types.Connection.Group.unknown,
    dhtAnnounce: Types.Connection.Group.unknown,
    autoDefine: Types.Constants.Boolean.false,
    external: "",
    public_ipv4: "",
  };

  users: Types.User.Model[] = [];
  nodes: Types.Node.Model[] = [];
  node = {
    name: DEFAULTS.NODE_NAME,
    key: null,
    cert: null,
    id: "",
    public_ipv4: "",
  };

  user = {
    name: DEFAULTS.USER_NAME,
    key: null,
    cert: null,
    id: "",
  };
}

export default Storage;
