import { parentPort } from "node:worker_threads";
import { Event, Config, API } from "../types";
import logger from "./logger";
import { C_API, C_Event, C_System } from "@dogma-project/constants-meta";

type MapPredicate<T> = T extends C_Event.Type.Service
  ? C_System.States
  : T extends C_Event.Type.Config
  ? Config.Value<T>
  : T extends C_Event.Type.Services
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
  constructor(private services: C_Event.Type.Service[] = []) {}

  private listeners: {
    [index: string]: [C_Event.Type[], any][];
  } = {};
  private state: {
    [key in C_Event.Type]?: MapPredicate<key>;
  } = {};
  private trigger = Symbol("trigger");

  /**
   *
   * @param '[array of events]'
   * @param '([array of payloads], type?, action?)'
   */
  public subscribe = <T extends C_Event.Type, U extends ReadonlyArray<T>>(
    type: [...U],
    callback: Listener<U>
  ) => {
    type.forEach((key) => {
      if (this.listeners[key] === undefined) this.listeners[key] = [];
      this.listeners[key].push([type, callback]);
    });
  };

  /**
   * Emits state change
   * @param type
   * @param payload
   */
  public emit(type: C_Event.Type.ConfigBool, payload: boolean): void;
  public emit(type: C_Event.Type.ConfigStr, payload: string): void;
  public emit(type: C_Event.Type.ConfigNum, payload: number): void;
  public emit(
    type: C_Event.Type.Config,
    payload: number | string | boolean
  ): void;
  public emit(type: C_Event.Type.Service, payload: C_System.States): void;
  public emit(type: C_Event.Type.Services, payload: Event.ServicesList): void;
  public emit(type: C_Event.Type.Storage, payload: any): void;
  public emit(type: C_Event.Type.Action, payload: any): void;
  public emit(type: C_Event.Type, payload: typeof this.trigger): void;
  public emit(type: C_Event.Type, payload: any) {
    try {
      let action: C_Event.Action = C_Event.Action.update;
      if (this.state[type] === undefined) {
        action = C_Event.Action.set;
      }
      if (payload !== this.trigger) {
        if (JSON.stringify(this.state[type]) === JSON.stringify(payload))
          return;
        this.state[type] = payload; // test
        const event: API.ResponseEvent = {
          type: C_API.ApiRequestType.system, // edit !!!!!!!!
          action: C_API.ApiRequestAction.set,
          event: type,
          payload,
        };
        parentPort?.postMessage(event);
      } else {
        if (this.state[type] === undefined) {
          this.state[type] = this.trigger;
        }
      }
      if (this.listeners[type] === undefined) {
        return logger.debug("state", "There's no handlers for event", type);
      }
      if (this.services.indexOf(type as C_Event.Type.Service) > -1) {
        // edit
        const services = this.services.map((type) => {
          return {
            service: type,
            state:
              (this.state[type] as C_System.States) || C_System.States.disabled,
          };
        });
        this.emit(C_Event.Type.services, services);
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
    } catch (err) {
      logger.error("State manager", err);
    }
  }

  /**
   *
   * @param type forces event for some type like its value has changed
   */
  public enforce(type: C_Event.Type) {
    this.emit(type, this.trigger);
  }

  public get(type: C_Event.Type.ConfigBool): boolean | undefined;
  public get(type: C_Event.Type.ConfigStr): string | undefined;
  public get(type: C_Event.Type.ConfigNum): number | undefined;
  public get(type: C_Event.Type.Service): C_System.States | undefined;
  public get(type: C_Event.Type.Services): Event.ServicesList | undefined;
  public get<T>(type: C_Event.Type.Storage): T | undefined;
  public get<T>(type: C_Event.Type.Action): T | undefined;
  public get(type: C_Event.Type): any {
    return this.state[type];
  }
}

export default StateManager;
