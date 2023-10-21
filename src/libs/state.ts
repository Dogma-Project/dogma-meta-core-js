import { Types } from "../types";
import logger from "./logger";

class StateManager {
  private _services: {
    [index: string | symbol]: Types.System.States;
  } = {
    router: Types.System.States.disabled,
    masterKey: Types.System.States.disabled,
    nodeKey: Types.System.States.disabled,
    database: Types.System.States.disabled,
    dhtBootstrap: Types.System.States.disabled,
    dhtLookup: Types.System.States.disabled,
    dhtAnnounce: Types.System.States.disabled,
    localDiscovery: Types.System.States.disabled,
  };

  private _servicesHandler: ProxyHandler<typeof this._services> = {
    get: (obj, prop) => {
      return obj[prop];
    },
    set: (obj, prop, value) => {
      if (obj[prop] === value) return true;
      obj[prop] = value;
      // EventEmitter.emit("services", obj);
      return true;
    },
  };

  private listeners: {
    [index: Types.Event.Type]: Types.Event.ArrayOfListeners[];
  } = {};

  public state: {
    [index: Types.Event.Type]: any;
  } = {};

  public services = new Proxy(this._services, this._servicesHandler);

  /**
   *
   * @param type array of events
   * @param callback (action, value, type)
   */
  public subscribe = (
    type: Types.Event.Type[],
    callback: Types.Event.Listenter
  ) => {
    type.forEach((key) => {
      if (this.listeners[key] === undefined) this.listeners[key] = [];
      this.listeners[key].push([type, callback]);
    });
  };

  /**
   *
   * @param type
   * @param payload Any payload | or Boolean "true" for forced emit
   */
  public emit = (type: Types.Event.Type, payload: any | boolean) => {
    let action: Types.Event.Action = Types.Event.Action.update;
    if (this.listeners[type] === undefined)
      return logger.warn("state", "key isn't registered", type);
    if (this.state[type] === undefined) action = Types.Event.Action.set;
    if (payload !== true) {
      if (JSON.stringify(this.state[type]) === JSON.stringify(payload)) return; // logger.warn("state", "nothing to emit", type);
      this.state[type] = payload;
    }
    this.listeners[type].forEach((entry) => {
      if (!entry.length) return;
      let ready = entry[0].every((val) => this.state[val] !== undefined);
      ready && entry[1](action, payload, type); // edit
    });
  };
}

export default StateManager;
