import "./init";
import stateManager from "./components/state";
import { Event, System } from "./types";
import { getArg } from "./modules/arguments";

export default function run(prefix?: string) {
  stateManager.enforce(Event.Type.start);
  const auto = getArg(System.Args.auto);
  const final =
    prefix || getArg(System.Args.prefix) || (auto ? "default" : null);
  if (final) {
    stateManager.emit(Event.Type.prefix, final);
  }
}
