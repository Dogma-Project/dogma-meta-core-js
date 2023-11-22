import Constants from "./constants";
import Event from "./event";
declare namespace Config {
    namespace Model {
        type Row = {
            param: Event.Type;
            value: string | number | Constants.Boolean;
        };
    }
    type Model = Model.Row | Model.Row[];
}
export default Config;
