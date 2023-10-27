import stateManager from "./state";
import { Event, System } from "../types";
import checkHomeDir from "../modules/checkHomeDir";
import logger from "../modules/logger";

stateManager.subscribe([Event.Type.start], () => {
  checkHomeDir()
    .then(() => {
      stateManager.emit(Event.Type.homeDir, System.States.full);
    })
    .catch((err) => {
      logger.error("Home Dir", err);
      stateManager.emit(Event.Type.homeDir, System.States.error);
    });
});
