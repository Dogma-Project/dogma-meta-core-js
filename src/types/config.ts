import { Constants } from "./constants";
import { Event } from "./event";

export namespace Config {
  export type Value = string | number | Constants.Boolean;
  export namespace Model {
    export type Row = {
      param: Event.Type.Config;
      value: Value;
    };
  }
  export type Model = Model.Row | Model.Row[];
}
