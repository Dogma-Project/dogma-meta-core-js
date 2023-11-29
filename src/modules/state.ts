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

class StateManager {
  constructor(private services: Event.Type.Service[] = []) {}

  private listeners: {
    [index: string]: [Event.Type[], any][];
  } = {};
  public state: {
    [key in Event.Type]?: MapPredicate<key>;
  } = {};
  private trigger = Symbol("trigger");

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
   * @param payload Any payload
   */
  public emit(type: Event.Type.ConfigBool, payload: boolean): void;
  public emit(type: Event.Type.ConfigStr, payload: string): void;
  public emit(type: Event.Type.ConfigNum, payload: number): void;
  public emit(
    type: Event.Type.Config,
    payload: number | string | boolean
  ): void;
  public emit(type: Event.Type.Service, payload: System.States): void;
  public emit(type: Event.Type.Services, payload: Event.ServicesList): void;
  public emit(type: Event.Type.Storage, payload: any): void;
  public emit(type: Event.Type.Action, payload: any): void;
  public emit(type: Event.Type, payload: typeof this.trigger): void;
  public emit(type: Event.Type, payload: any) {
    let action: Event.Action = Event.Action.update;
    if (this.state[type] === undefined) {
      action = Event.Action.set;
    }
    if (payload !== this.trigger) {
      if (JSON.stringify(this.state[type]) === JSON.stringify(payload)) return;
      this.state[type] = payload; // test
    } else {
      if (this.state[type] === undefined) {
        this.state[type] = this.trigger;
      }
    }
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

  public enforce(type: Event.Type) {
    this.emit(type, this.trigger);
  }
}

export default StateManager;
