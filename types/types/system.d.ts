export declare namespace System {
    enum LogLevel {
        nothing = 0,
        errors = 1,
        debug = 2,
        info = 3,
        warnings = 4,
        logs = 5
    }
    enum States {
        error = -1,
        disabled = 0,
        ready = 1,
        empty = 2,
        reload = 3,
        limited = 4,
        ok = 5,
        full = 6
    }
    enum Args {
        auto = "auto",
        discovery = "discovery",
        master = "master",
        node = "node",
        port = "port",
        loglevel = "loglevel",
        prefix = "prefix"
    }
}
