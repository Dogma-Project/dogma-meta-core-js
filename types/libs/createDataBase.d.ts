import { Config } from "./model";
import { Types } from "../types";
/** @module CreateDataBase */
export declare const createConfigTable: (defaults: Types.Config.Params) => Promise<void>;
export declare const createUsersTable: (store: Types.Store) => Promise<any>;
export declare const createNodesTable: (store: Types.Store, defaults: Types.Config.Params) => Promise<unknown>;
export declare const createDataBase: (store: Types.Store, defaults: Types.Config.Params) => Promise<unknown>;
