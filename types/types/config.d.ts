import { Constants } from "./constants";
import { Event } from "./event";
export declare namespace Config {
    type Value = string | number | Constants.Boolean;
    namespace Model {
        type Row = {
            param: Event.Type.Config;
            value: Value;
        };
    }
    type Model = Model.Row | Model.Row[];
}
