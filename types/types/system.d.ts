declare namespace System {
    enum LogLevel {
        nothing,
        errors,
        debug,
        info,
        warnings,
        logs
    }
    enum States {
        error,
        disabled,
        ready,
        empty,
        reload,
        limited,
        ok,
        full
    }
}
export default System;
