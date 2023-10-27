import state from "./state";
import stateManager from "./state";
import { Event } from "../types";
import {
  ConfigModel,
  NodeModel,
  DHTModel,
  UserModel,
  MessageModel,
  ProtocolModel,
  FileModel,
  SyncModel,
} from "../modules/model";

const configModel = new ConfigModel({ state });
const nodeModel = new NodeModel({ state });
const dhtModel = new DHTModel({ state });
const userModel = new UserModel({ state });

stateManager.subscribe([Event.Type.start, Event.Type.homeDir], () => {
  configModel.init();
  nodeModel.init();
  dhtModel.init();
  userModel.init();
});

export { dhtModel };
