declare namespace System {
  export enum LogLevel {
    nothing,
    errors,
    debug,
    info,
    warnings,
    logs,
  }
  export enum States {
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
