import Connections from "../modules/connections";
import storage from "./storage";
import state from "./state";
import * as Types from "../types";
import { userModel, nodeModel } from "./model";
import { C_Sync } from "../types/constants";

const models: Types.Model.All = {};
models[C_Sync.Type.users] = userModel;
models[C_Sync.Type.nodes] = nodeModel;
const connections = new Connections({ storage, state, models });

export default connections;
