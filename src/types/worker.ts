import { System } from "./system";

export namespace Worker {
    export interface Options {
        prefix: string;
        /**
         * enforces router port ignoring settings
         */
        routerPort?: number;
        /**
         * auto generate node. default: false
         */
        auto?: boolean;
        /**
         * force node to run as passive discovery server. default: false
         */
        discovery?: boolean;
        /**
         * sets log level. default: C_System.LogLevel.info
         */
        loglevel?: System.LogLevel;
      }
}