import "./init";
import stateManager from "./components/state";
import { Event } from "./types";

export default function run() {
  stateManager.emit(Event.Type.start, true);
}
