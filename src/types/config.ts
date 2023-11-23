import { Constants } from "./constants";
import { Event } from "./event";

export namespace Config {
  export namespace Model {
    export type Row = {
      param: Event.Type;
      value: string | number | Constants.Boolean;
    };
  }
  export type Model = Model.Row | Model.Row[];
}
