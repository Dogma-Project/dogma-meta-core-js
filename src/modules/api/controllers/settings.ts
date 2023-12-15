import { API } from "../../../types";
import stateManager from "../../../components/state";
import { C_API, C_Event } from "@dogma-project/constants-meta";
import { configModel } from "../../../components/model";
import logger from "../../logger";
import WorkerApi from "../index";

function getConfig() {
  return {
    [C_Event.Type.configRouter]: stateManager.get(C_Event.Type.configRouter),
    [C_Event.Type.configDhtLookup]: stateManager.get(
      C_Event.Type.configDhtLookup
    ),
    [C_Event.Type.configDhtAnnounce]: stateManager.get(
      C_Event.Type.configDhtAnnounce
    ),
    [C_Event.Type.configDhtBootstrap]: stateManager.get(
      C_Event.Type.configDhtBootstrap
    ),
    [C_Event.Type.configAutoDefine]: stateManager.get(
      C_Event.Type.configAutoDefine
    ),
    [C_Event.Type.configExternal]: stateManager.get(
      C_Event.Type.configExternal
    ),
    [C_Event.Type.configLocalDiscovery]: stateManager.get(
      C_Event.Type.configLocalDiscovery
    ),
    [C_Event.Type.configPublicIpV4]: stateManager.get(
      C_Event.Type.configPublicIpV4
    ),
  };
}

async function setConfig(body: {} = {}) {
  let count = 0;
  if (C_Event.Type.configRouter in body) {
    try {
      await configModel.persistConfig({
        param: C_Event.Type.configRouter,
        value: Number(body[C_Event.Type.configRouter]),
      });
      count++;
    } catch (err) {
      logger.error("API", "setConfig", err);
    }
  }
  if (C_Event.Type.configDhtAnnounce in body) {
    try {
      await configModel.persistConfig({
        param: C_Event.Type.configDhtAnnounce,
        value: Number(body[C_Event.Type.configDhtAnnounce]),
      });
      count++;
    } catch (err) {
      logger.error("API", "setConfig", err);
    }
  }
  if (C_Event.Type.configDhtLookup in body) {
    try {
      await configModel.persistConfig({
        param: C_Event.Type.configDhtLookup,
        value: Number(body[C_Event.Type.configDhtLookup]),
      });
      count++;
    } catch (err) {
      logger.error("API", "setConfig", err);
    }
  }
  if (C_Event.Type.configDhtBootstrap in body) {
    try {
      await configModel.persistConfig({
        param: C_Event.Type.configDhtBootstrap,
        value: Number(body[C_Event.Type.configDhtBootstrap]),
      });
      count++;
    } catch (err) {
      logger.error("API", "setConfig", err);
    }
  }
  if (C_Event.Type.configAutoDefine in body) {
    try {
      await configModel.persistConfig({
        param: C_Event.Type.configAutoDefine,
        value: !!body[C_Event.Type.configAutoDefine],
      });
      count++;
    } catch (err) {
      logger.error("API", "setConfig", err);
    }
  }
  if (C_Event.Type.configLocalDiscovery in body) {
    try {
      await configModel.persistConfig({
        param: C_Event.Type.configLocalDiscovery,
        value: !!body[C_Event.Type.configLocalDiscovery],
      });
      count++;
    } catch (err) {
      logger.error("API", "setConfig", err);
    }
  }
  if (C_Event.Type.configExternal in body) {
    try {
      await configModel.persistConfig({
        param: C_Event.Type.configExternal,
        value: String(body[C_Event.Type.configExternal]),
      });
      count++;
    } catch (err) {
      logger.error("API", "setConfig", err);
    }
  }
  if (C_Event.Type.configPublicIpV4 in body) {
    try {
      await configModel.persistConfig({
        param: C_Event.Type.configPublicIpV4,
        value: String(body[C_Event.Type.configPublicIpV4]),
      });
      count++;
    } catch (err) {
      logger.error("API", "setConfig", err);
    }
  }
  return count;
}

export default function SettingsController(this: WorkerApi, data: API.Request) {
  switch (data.action) {
    case C_API.ApiRequestAction.get:
      this.response({
        type: C_API.ApiRequestType.settings,
        action: C_API.ApiRequestAction.set,
        id: data.id,
        payload: {
          settings: getConfig(),
        },
      });
      break;
    case C_API.ApiRequestAction.set:
      // set values
      setConfig(data.payload)
        .then((res) => {
          this.response({
            type: C_API.ApiRequestType.settings,
            action: C_API.ApiRequestAction.result,
            id: data.id,
            payload: {
              result: true,
              upserted: res,
            },
          });
        })
        .catch((err) => {
          logger.error("API", "settings", err);
          // add
        });
      break;
    case C_API.ApiRequestAction.push:
      // insert defaults
      configModel
        .insertDefaults()
        .then(() => {
          this.response({
            type: C_API.ApiRequestType.settings,
            action: C_API.ApiRequestAction.result,
            id: data.id,
            payload: {
              result: true,
            },
          });
        })
        .catch((err) => {
          logger.error("API", "settings", err);
          // add
        });
      break;
    default:
      // error
      break;
  }
}
