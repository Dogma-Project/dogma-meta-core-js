import stateManager from "./state";
import checkHomeDir from "../modules/checkHomeDir";
import logger from "../modules/logger";
import { C_Event, C_System } from "@dogma-project/constants-meta";

stateManager.subscribe([C_Event.Type.start], () => {
  stateManager.emit(C_Event.Type.dirStatus, C_System.States.ready);
  // trigger prefix
});

stateManager.subscribe(
  [C_Event.Type.dirStatus, C_Event.Type.prefix],
  ([dirStatus, prefix]) => {
    const state = dirStatus as C_System.States;
    switch (state) {
      case C_System.States.ready:
      case C_System.States.reload:
        checkHomeDir(prefix)
          .then(() => {
            stateManager.emit(C_Event.Type.dirStatus, C_System.States.full);
          })
          .catch((err: Error | number) => {
            if (err === 1) {
              stateManager.emit(C_Event.Type.dirStatus, C_System.States.empty);
            } else {
              logger.error("Home Dir", err);
              stateManager.emit(C_Event.Type.dirStatus, C_System.States.error);
            }
          });
        break;
      case C_System.States.empty:
        logger.log("Home Dir", "Prefix is empty");
        break;
      default:
        // do nothing
        break;
    }
  }
);
