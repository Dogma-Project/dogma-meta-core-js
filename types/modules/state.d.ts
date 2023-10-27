/// <reference types="node" />
import * as Types from "../types";
declare class StateManager {
    private _services;
    private _servicesHandler;
    private listeners;
    state: {
        [index: string]: any;
    };
    services: {
        [index: string]: Types.System.States;
        [index: symbol]: Types.System.States;
    };
    /**
     *
     * @param 'array of events'
     * @param (payload, type?, action?)
     */
    subscribe: (type: Types.Event.Type[], callback: Types.Event.Listenter) => void;
    /**
     *
     * @param type
     * @param payload Any payload | or Boolean "true" for forced emit
     */
    emit: (type: Types.Event.Type, payload: any | boolean) => void;
}
export default StateManager;
