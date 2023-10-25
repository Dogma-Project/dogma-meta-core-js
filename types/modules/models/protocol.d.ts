import { PROTOCOL } from "../../constants";
declare const model: {
    getAll(): Promise<any>;
    persistProtocol(protocol: typeof PROTOCOL): Promise<unknown>;
};
export default model;
