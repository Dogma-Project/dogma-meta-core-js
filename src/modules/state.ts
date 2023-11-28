import { Event, System, Config, Constants } from "../types";
import logger from "./logger";

type MapPredicate<T> = T extends Event.Type.Service
  ? System.States
  : T extends Event.Type.Config
  ? Config.Value<T>
  : T extends Event.Type.Services
  ? Event.ServicesList
  : any;

type Mapped<
  Arr extends ReadonlyArray<unknown>,
  Result extends Array<unknown> = []
> = Arr extends [infer Head, ...infer Tail]
  ? Mapped<[...Tail], [...Result, MapPredicate<Head>]>
  : Result;

type Listener<U extends ReadonlyArray<any>> = (
  args: Mapped<U>,
  type: any,
  action: any
) => void;

type IOverload = {
  (type: Event.Type, payload: any | boolean): void;
  (param: object): void;
};

class StateManager {
  constructor(private services: Event.Type.Service[] = []) {}

  private listeners: {
    [index: string]: [Event.Type[], any][];
  } = {};
  public state: {
    [key in Event.Type]?: MapPredicate<key>;
  } = {};

  /**
   *
   * @param '[array of events]'
   * @param '([array of payloads], type?, action?)'
   */
  public subscribe = <T extends Event.Type, U extends ReadonlyArray<T>>(
    type: [...U],
    callback: Listener<U>
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
  public emit(type: Event.Type.ConfigBool, payload: Constants.Boolean): void;
  public emit(type: Event.Type.ConfigStr, payload: string): void;
  public emit(type: Event.Type.ConfigNum, payload: number): void;
  public emit(
    type: Event.Type.Config,
    payload: number | string | Constants.Boolean
  ): void;
  public emit(type: Event.Type.Service, payload: System.States): void;
  public emit(type: Event.Type.Services, payload: Event.ServicesList): void;
  public emit(type: Event.Type.Storage, payload: any): void;
  public emit(type: Event.Type.Action, payload: any): void;
  public emit(type: Event.Type, payload: any) {
    // logger.info("Event emitted", type, payload);
    let action: Event.Action = Event.Action.update;
    if (this.state[type] === undefined) {
      action = Event.Action.set;
    }
    if (payload !== true) {
      if (JSON.stringify(this.state[type]) === JSON.stringify(payload)) return;
    }
    this.state[type] = payload; // test
    if (this.listeners[type] === undefined) {
      return logger.debug("state", "There's no handlers for event", type);
    }
    if (this.services.indexOf(type as Event.Type.Service) > -1) {
      // edit
      const services = this.services.map((type) => {
        return {
          service: type,
          state: (this.state[type] as System.States) || System.States.disabled,
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
  }
}

export default StateManager;
