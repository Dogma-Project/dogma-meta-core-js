import { Event, System, Config } from "../types";
type MapPredicate<T> = T extends Event.Type.Service ? System.States : T extends Event.Type.Config ? Config.Value<T> : T extends Event.Type.Services ? Event.ServicesList : any;
type Mapped<Arr extends ReadonlyArray<unknown>, Result extends Array<unknown> = []> = Arr extends [infer Head, ...infer Tail] ? Mapped<[...Tail], [...Result, MapPredicate<Head>]> : Result;
type Listener<U extends ReadonlyArray<any>> = (args: Mapped<U>, type: any, action: any) => void;
declare class StateManager {
    private services;
    constructor(services?: Event.Type.Service[]);
    private listeners;
    state: {
        [key in Event.Type]?: MapPredicate<key>;
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
    emit(type: Event.Type.ConfigBool, payload: boolean): void;
    emit(type: Event.Type.ConfigStr, payload: string): void;
    emit(type: Event.Type.ConfigNum, payload: number): void;
    emit(type: Event.Type.Config, payload: number | string | boolean): void;
    emit(type: Event.Type.Service, payload: System.States): void;
    emit(type: Event.Type.Services, payload: Event.ServicesList): void;
    emit(type: Event.Type.Storage, payload: any): void;
    emit(type: Event.Type.Action, payload: any): void;
}
export default StateManager;
