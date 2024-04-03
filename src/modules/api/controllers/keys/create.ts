import { C_Event, C_Keys, C_System } from "../../../../types/constants";
import storage from "../../../../components/storage";
import stateManager from "../../../../components/state";
import { createKeyPair } from "../../../keys";

export default async function createKey({
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
        // ERRORS.UNKNOWN_KEY_TYPE
        return Promise.reject("UNKNOWN_KEY_TYPE");
    }
    const keyState = stateManager.get(keyEvent);
    if (!keyState || keyState > C_System.States.empty) {
      // ERRORS.KEY_IS_NOT_EMPTY
      return Promise.reject("KEY_IS_NOT_EMPTY");
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
