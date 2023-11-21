import { Event, System } from "../types";
import logger from "./logger";

class StateManager {
  constructor(private services: Event.Type[] = []) {}

  private listeners: {
    [index: string]: Event.ArrayOfListeners[];
  } = {};
  public state: {
    [index: string]: any;
  } = {};

  /**
   *
   * @param '[array of events]'
   * @param '([array of payloads], type?, action?)'
   */
  public subscribe = (type: Event.Type[], callback: Event.Listenter) => {
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
  public emit = (type: Event.Type, payload: any | boolean) => {
    logger.info("Event emitted", type, payload);
    let action: Event.Action = Event.Action.update;
    if (this.listeners[type] === undefined) {
      return logger.warn("state", "key isn't registered", type);
    }
    if (this.state[type] === undefined) {
      action = Event.Action.set;
    }
    if (payload !== true) {
      if (JSON.stringify(this.state[type]) === JSON.stringify(payload)) return;
    }
    this.state[type] = payload; // test
    if (this.services.indexOf(type) > -1) {
      const services = this.services.map((type) => {
        return {
          service: type,
          state: this.state[type] || System.States.disabled,
        };
      });
      this.emit(Event.Type.services, services);
    }
    this.listeners[type].forEach((entry) => {
      if (!entry.length) return;
      let ready = true;
      const result = entry[0].map((val) => {
        if (this.state[val] === undefined) ready = false;
        return this.state[val];
      });
      ready && entry[1](result, type, action); // edit
    });
  };
}

export default StateManager;
