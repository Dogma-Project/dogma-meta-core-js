import { Types } from "../../types";
declare const model: {
    getAll(): Promise<any>;
    persistConfig(config: Types.Config.Model): Promise<unknown>;
};
export default model;
