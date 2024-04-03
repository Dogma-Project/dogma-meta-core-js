import { C_Event } from "./constants";

export namespace Config {
  export type Value<T extends C_Event.Type.Config> =
    T extends C_Event.Type.ConfigStr
      ? string
      : T extends C_Event.Type.ConfigBool
      ? boolean
      : T extends C_Event.Type.ConfigNum
      ? number
      : never;

  export namespace Model {
    export type Row = {
      param: C_Event.Type.Config;
      value: Value<C_Event.Type.Config>;
    };
  }
  export type Model = Model.Row | Model.Row[];
}
