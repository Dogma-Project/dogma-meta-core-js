import * as Types from "../types";
import { C_Defaults } from "../constants";

class Storage {
  node: Types.Node.Storage = {
    id: null,
    name: C_Defaults.nodeName,
    privateKey: null,
    publicKey: null,
    router_port: null,
  };
  user: Types.User.Storage = {
    id: null,
    name: C_Defaults.userName,
    privateKey: null,
    publicKey: null,
  };
}

export default Storage;
