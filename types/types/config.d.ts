import { C_Event } from "@dogma-project/constants-meta";
export declare namespace Config {
    type Value<T extends C_Event.Type.Config> = T extends C_Event.Type.ConfigStr ? string : T extends C_Event.Type.ConfigBool ? boolean : T extends C_Event.Type.ConfigNum ? number : never;
    namespace Model {
        type Row = {
            param: C_Event.Type.Config;
            value: Value<C_Event.Type.Config>;
        };
    }
    type Model = Model.Row | Model.Row[];
}
