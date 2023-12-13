import { C_Event } from "@dogma-project/constants-meta";
import stateManager from "./state";
import storage from "./storage";
import * as Types from "../types";
import logger from "../modules/logger";

// stateManager.subscribe(
//   [C_Event.Type.sync, C_Event.Type.nodes],
//   ([sync, nodes]) => {
//     logger.error("PRE", sync);
//     logger.error("PRE 2", nodes);
//     // send request
//   }
// );
