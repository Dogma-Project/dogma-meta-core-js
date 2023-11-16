import * as Types from "../types";
import { DEFAULTS } from "../constants";

class Storage {
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
