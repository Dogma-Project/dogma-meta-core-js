import { Constants } from "./constants";
import { Event } from "./event";
export declare namespace Config {
    namespace Model {
        type Row = {
            param: Event.Type.Config;
            value: string | number | Constants.Boolean;
        };
    }
    type Model = Model.Row | Model.Row[];
}
