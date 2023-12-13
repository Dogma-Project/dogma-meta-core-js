import Connections from "../modules/connections";
import storage from "./storage";
import state from "./state";

const connections = new Connections({ storage, state });

export default connections;
