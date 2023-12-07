import { Event, Config } from "../types";
import { C_Event, C_System } from "@dogma-project/constants-meta";
type MapPredicate<T> = T extends C_Event.Type.Service ? C_System.States : T extends C_Event.Type.Config ? Config.Value<T> : T extends C_Event.Type.Services ? Event.ServicesList : any;
type Mapped<Arr extends ReadonlyArray<unknown>, Result extends Array<unknown> = []> = Arr extends [infer Head, ...infer Tail] ? Mapped<[...Tail], [...Result, MapPredicate<Head>]> : Result;
type Listener<U extends ReadonlyArray<any>> = (args: Mapped<U>, type: any, action: any) => void;
declare class StateManager {
    private services;
    constructor(services?: C_Event.Type.Service[]);
    private listeners;
    state: {
        [key in C_Event.Type]?: MapPredicate<key>;
    };
    private trigger;
    /**
     *
     * @param '[array of events]'
     * @param '([array of payloads], type?, action?)'
     */
    subscribe: <T extends C_Event.Type, U extends readonly T[]>(type: [...U], callback: Listener<U>) => void;
    /**
     *
     * @param type
     * @param payload Any payload
     */
    emit(type: C_Event.Type.ConfigBool, payload: boolean): void;
    emit(type: C_Event.Type.ConfigStr, payload: string): void;
    emit(type: C_Event.Type.ConfigNum, payload: number): void;
    emit(type: C_Event.Type.Config, payload: number | string | boolean): void;
    emit(type: C_Event.Type.Service, payload: C_System.States): void;
    emit(type: C_Event.Type.Services, payload: Event.ServicesList): void;
    emit(type: C_Event.Type.Storage, payload: any): void;
    emit(type: C_Event.Type.Action, payload: any): void;
    emit(type: C_Event.Type, payload: typeof this.trigger): void;
    enforce(type: C_Event.Type): void;
}
export default StateManager;
