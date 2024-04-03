export namespace System {
  export enum LogLevel {
    nothing = 0,
    errors = 1,
    warnings = 2,
    info = 3,
    logs = 4,
    debug = 5,
  }
  export enum States {
    error = -1,
    disabled = 0,
    ready = 1,
    empty = 2,
    reload = 3,
    limited = 4,
    ok = 5,
    full = 6,
  }
}
