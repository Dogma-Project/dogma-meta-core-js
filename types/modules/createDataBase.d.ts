import { Config } from "./model";
import * as Types from "../types";
/** @module CreateDataBase */
export declare const createConfigTable: (defaults: Types.Config.Params) => Promise<void>;
export declare const createUsersTable: (store: Types.Store) => any;
export declare const createNodesTable: (store: Types.Store, defaults: Types.Config.Params) => any;
export declare const createDataBase: (store: Types.Store, defaults: Types.Config.Params) => Promise<unknown>;
