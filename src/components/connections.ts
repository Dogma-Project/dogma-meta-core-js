import Connections from "../modules/connections";
import storage from "./storage";
import state from "./state";

const connection = new Connections({ storage, state });

export default connection;
