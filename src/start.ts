import "./init";
import stateManager from "./components/state";
import { getArg } from "./modules/arguments";
import { C_Event, C_System } from "@dogma-project/constants-meta";
export default function run(prefix?: string) {
  stateManager.enforce(C_Event.Type.start);
  const auto = getArg(C_System.Args.auto);
  const final =
    prefix || getArg(C_System.Args.prefix) || (auto ? "default" : null);
  if (final) {
    stateManager.emit(C_Event.Type.prefix, final);
  }
}
