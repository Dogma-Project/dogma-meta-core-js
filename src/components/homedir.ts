import stateManager from "./state";
import { Event, System } from "../types";
import checkHomeDir from "../modules/checkHomeDir";
import logger from "../modules/logger";

stateManager.subscribe([Event.Type.start], () => {
  stateManager.emit(Event.Type.homeDir, System.States.ready);
});

stateManager.subscribe([Event.Type.homeDir], ([homeDir]) => {
  const state = homeDir as System.States;
  switch (state) {
    case System.States.ready:
    case System.States.reload:
      checkHomeDir()
        .then(() => {
          stateManager.emit(Event.Type.homeDir, System.States.full);
        })
        .catch((err: Error | number) => {
          if (err === 1) {
            stateManager.emit(Event.Type.homeDir, System.States.empty);
          } else {
            logger.error("Home Dir", err);
            stateManager.emit(Event.Type.homeDir, System.States.error);
          }
        });
      break;
    case System.States.empty:
      logger.log("Home Dir", "Prefix is empty");
      break;
    default:
      // do nothing
      break;
  }
});
