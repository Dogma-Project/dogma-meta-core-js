import { Event } from "../types";
declare class StateManager {
    private services;
    constructor(services?: Event.Type[]);
    private listeners;
    state: {
        [index: string]: any;
    };
    /**
     *
     * @param '[array of events]'
     * @param '([array of payloads], type?, action?)'
     */
    subscribe: (type: Event.Type[], callback: Event.Listenter) => void;
    /**
     *
     * @param type
     * @param payload Any payload | or Boolean "true" for forced emit
     */
    emit: (type: Event.Type, payload: any | boolean) => void;
}
export default StateManager;
