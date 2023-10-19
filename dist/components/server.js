"use strict";
subscribe(["server"], (_action, state) => {
    services.router = state;
});
subscribe(["server", "config-autoDefine", "config-external", "config-public_ipv4"], (_action, _state) => {
    const state = services.router;
    switch (state) {
        case STATES.LIMITED:
            connectionTester();
            break;
        case STATES.FULL:
            emit("externalPort", store.config.router);
            break;
    }
});
/**
 * @todo add "config-bootstrap" dependency
 */
subscribe(["config-router", "users", "node-key", "config-bootstrap"], (_action, _value, _type) => {
    const port = store.config.router;
    if (!services.router) {
        server.listen(port);
    }
    else {
        server.refresh(port);
    }
});
