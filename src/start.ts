import "./modules/prototypes";
import "./components/server";
import "./components/client";
import stateManager from "./components/state";
import { Event } from "./types";

stateManager.emit(Event.Type.start, true);

// import "./components/migration";
// import "./modules/sync";
