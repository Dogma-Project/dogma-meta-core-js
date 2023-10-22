import Connection from "../modules/connection";
import storage from "./storage";
import state from "./state";

const connection = new Connection({ storage, state });

export default connection;
