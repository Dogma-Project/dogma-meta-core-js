import {
  C_API,
  C_Event,
  C_Keys,
  C_System,
} from "@dogma-project/constants-meta";
import stateManager from "../../../components/state";
import storage from "../../../components/storage";
import { createKeyPair } from "../../keys";
import { API } from "../../../types";
import logger from "../../logger";
import WorkerApi from "../index";

async function createKey({
  name,
  length,
  type,
}: {
  name: string;
  length: 1024 | 2048 | 4096;
  type: C_Keys.Type;
}) {
  // add validation

  let keyEvent: C_Event.Type;
  try {
    switch (type) {
      case C_Keys.Type.userKey:
        keyEvent = C_Event.Type.userKey;
        storage.user.name = name;
        break;
      case C_Keys.Type.nodeKey:
        keyEvent = C_Event.Type.nodeKey;
        storage.node.name = name;
        break;
      default:
        return Promise.reject("UNKNOWN_KEY_TYPE");
        // return next(
        //   new ClientError({
        //     status: CLIENT_STATUSES.BAD_REQUEST,
        //     code: ERRORS.UNKNOWN_KEY_TYPE,
        //     payload: { type },
        //   })
        // );
        break;
    }
    const keyState = stateManager.get(keyEvent);
    if (!keyState || keyState > C_System.States.empty) {
      return Promise.reject("KEY_IS_NOT_EMPTY");
      // return next(
      //   new ClientError({
      //     status: CLIENT_STATUSES.BAD_REQUEST,
      //     code: ERRORS.KEY_IS_NOT_EMPTY,
      //     payload: {
      //       state: keyState,
      //     },
      //   })
      // );
    }

    await createKeyPair(type, length);
    stateManager.emit(keyEvent, C_System.States.ready);
    return {
      result: true,
    };
  } catch (err) {
    Promise.reject(err);
  }
}

export default function KeysController(this: WorkerApi, data: API.Request) {
  switch (data.action) {
    case C_API.ApiRequestAction.get:
      // this.response({
      //   type: API.ApiRequestType.keys,
      //   action: API.ApiRequestAction.set,
      //   id: data.id,
      //   payload: {
      //     settings: getConfig(),
      //   },
      // });
      break;
    case C_API.ApiRequestAction.set:
      createKey(data.payload)
        .then((res) => {
          this.response({
            type: C_API.ApiRequestType.keys,
            action: C_API.ApiRequestAction.result,
            id: data.id,
            payload: {
              result: true,
            },
          });
        })
        .catch((err) => {
          logger.error("API", "keys", err);
          // add
        });
      break;
    default:
      // error
      break;
  }
}
