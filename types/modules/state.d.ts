import { Event, System, Config } from "../types";
type MapPredicate<T> = T extends Event.Type.Service ? System.States : T extends Event.Type.Config ? Config.Value : any;
type Mapped<Arr extends ReadonlyArray<unknown>, Result extends Array<unknown> = []> = Arr extends [infer Head, ...infer Tail] ? Mapped<[...Tail], [...Result, MapPredicate<Head>]> : Result;
type Listener<U extends ReadonlyArray<any>> = (args: Mapped<U>, type: any, action: any) => void;
declare class StateManager {
    private services;
    constructor(services?: Event.Type.Service[]);
    private listeners;
    state: {
        [index: string]: any;
    };
    /**
     *
     * @param '[array of events]'
     * @param '([array of payloads], type?, action?)'
     */
    subscribe: <T extends Event.Type, U extends readonly T[]>(type: [...U], callback: Listener<U>) => void;
    /**
     *
     * @param type
     * @param payload Any payload | or Boolean "true" for forced emit
     */
    emit: (type: Event.Type, payload: any | boolean) => void;
}
export default StateManager;
