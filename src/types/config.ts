import { C_Event } from "../constants";
import { Event } from "./event";

export namespace Config {
  export type Value<T extends Event.Type.Config> =
    T extends Event.Type.ConfigStr
      ? string
      : T extends Event.Type.ConfigBool
      ? boolean
      : T extends Event.Type.ConfigNum
      ? number
      : never;

  export namespace Model {
    export type Row = {
      param: Event.Type.Config;
      value: Value<Event.Type.Config>;
    };
  }
  export type Model = Model.Row | Model.Row[];
}
