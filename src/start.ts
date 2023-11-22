import "./init";
import stateManager from "./components/state";
import { Event } from "./types";

// process.stdin.resume();

stateManager.emit(Event.Type.start, true);
