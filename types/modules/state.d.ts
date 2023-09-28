export const services: any;
export const state: {};
/** @module State */
/**
 *
 * @param {Array} type array of events
 * @param {Function} callback (action, value, type)
 */
export function subscribe(type: any[], callback: Function): void;
/**
 *
 * @param {String} type
 * @param {*} payload Any payload | or Boolean "true" for forced emit
 */
export function emit(type: string, payload: any): any;
