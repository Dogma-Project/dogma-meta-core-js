import EventEmitter from "./eventEmitter";
import logger from "../logger";
import { STATES } from "./constants";

type DogmaEventAction = "update" | "set";
type DogmaEventPayload = any;
type DogmaEventType = string; // edit
type DogmaEventListener = (
  action: DogmaEventAction,
  payload: DogmaEventPayload,
  type: DogmaEventType
) => void;

type ArrayOfListeners = [DogmaEventType[], DogmaEventListener] | [];

const state: {
  [index: DogmaEventType]: any;
} = {};
const listeners: {
  [index: DogmaEventType]: ArrayOfListeners[];
} = {};

const _services = {
  router: STATES.DISABLED,
  masterKey: STATES.DISABLED,
  nodeKey: STATES.DISABLED,
  database: STATES.DISABLED,
  dhtBootstrap: STATES.DISABLED,
  dhtLookup: STATES.DISABLED,
  dhtAnnounce: STATES.DISABLED,
  localDiscovery: STATES.DISABLED,
};

/** @module State */

/**
 *
 * @param type array of events
 * @param callback (action, value, type)
 */
export const subscribe = (
  type: DogmaEventType[],
  callback: DogmaEventListener
) => {
  type.forEach((key) => {
    if (listeners[key] === undefined) listeners[key] = [];
    listeners[key].push([type, callback]);
  });
};

/**
 *
 * @param type
 * @param payload Any payload | or Boolean "true" for forced emit
 */
export const emit = (type: DogmaEventType, payload: any | boolean) => {
  let action: DogmaEventAction = "update";
  if (listeners[type] === undefined)
    return logger.warn("state", "key isn't registered", type);
  if (state[type] === undefined) action = "set";
  if (payload !== true) {
    if (JSON.stringify(state[type]) === JSON.stringify(payload)) return; // logger.warn("state", "nothing to emit", type);
    state[type] = payload;
  }
  listeners[type].forEach((entry) => {
    if (!entry.length) return;
    let ready = entry[0].every((val) => state[val] !== undefined);
    ready && entry[1](action, payload, type); // edit
  });
};

const servicesHandler: ProxyHandler<any> = {
  get: (obj, prop) => {
    return obj[prop];
  },
  set: (obj, prop, value) => {
    if (obj[prop] === value) return true;
    obj[prop] = value;
    EventEmitter.emit("services", obj);
    return true;
  },
};

export const services = new Proxy(_services, servicesHandler);

module.exports.state = state;
module.exports.subscribe = subscribe;
module.exports.emit = emit;
module.exports.services = services;
