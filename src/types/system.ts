declare namespace System {
  export const enum LogLevel {
    nothing,
    errors,
    debug,
    info,
    warnings,
    logs,
  }
  export const enum States {
    error,
    disabled,
    ready,
    empty,
    reload,
    limited,
    ok,
    full,
  }
}

export default System;
