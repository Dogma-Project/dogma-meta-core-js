export let ss: {};
export let port: number;
export let service: null;
export function listen(port: number): void;
export function stop(cb: Function): void;
export function refresh(port: number): void;
export function permitUnauthorized(): boolean;
