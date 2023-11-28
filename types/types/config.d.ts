import { Event } from "./event";
import { Constants } from "./constants";
export declare namespace Config {
    type Value<T extends Event.Type.Config> = T extends Event.Type.ConfigStr ? string : T extends Event.Type.ConfigBool ? Constants.Boolean : T extends Event.Type.ConfigNum ? number : never;
    namespace Model {
        type Row = {
            param: Event.Type.Config;
            value: Value<Event.Type.Config>;
        };
    }
    type Model = Model.Row | Model.Row[];
}
