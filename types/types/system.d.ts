declare namespace System {
    const enum LogLevel {
        nothing = 0,
        errors = 1,
        debug = 2,
        info = 3,
        warnings = 4,
        logs = 5
    }
    const enum States {
        error = 0,
        disabled = 1,
        ready = 2,
        empty = 3,
        reload = 4,
        limited = 5,
        ok = 6,
        full = 7
    }
}
export default System;
