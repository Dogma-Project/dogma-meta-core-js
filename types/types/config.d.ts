import Constants from "./constants";
declare namespace Config {
    type Model = {
        [key: string]: string | number | Constants.Boolean;
    };
}
export default Config;
