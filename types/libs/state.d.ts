type DogmaEventAction = "update" | "set";
type DogmaEventPayload = any;
type DogmaEventType = string;
type DogmaEventListener = (action: DogmaEventAction, payload: DogmaEventPayload, type: DogmaEventType) => void;
export declare const state: {
    [index: DogmaEventType]: any;
};
/** @module State */
/**
 *
 * @param type array of events
 * @param callback (action, value, type)
 */
export declare const subscribe: (type: DogmaEventType[], callback: DogmaEventListener) => void;
/**
 *
 * @param type
 * @param payload Any payload | or Boolean "true" for forced emit
 */
export declare const emit: (type: DogmaEventType, payload: any | boolean) => void;
export declare const services: any;
export {};
