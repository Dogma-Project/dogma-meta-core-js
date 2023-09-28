"use strict";
const tls = require("node:tls");
const logger = require("../logger");
const { store } = require("./store");
const { state, services, emit, subscribe } = require("./state");
const LocalDiscovery = require("./localDiscovery");
const connectionTester = require("./connectionTester");
const connection = require("./connection");
const dht = require("./dht");
const args = require("./arguments");
const { DHTPERM, STATES } = require("./constants");
/** @module Server */
/**
 *
 * @returns {Object} {key, cert, ca, requestCert, rejectUnauthorized }
 */
const getOptions = () => {
    return {
        key: store.node.key,
        cert: store.node.cert,
        ca: store.ca,
        requestCert: true,
        rejectUnauthorized: !server.permitUnauthorized(),
    };
};
const server = (module.exports = {
    ss: {},
    port: 0,
    service: null,
    /**
     *
     * @param {Number} port
     */
    listen: (port) => {
        server.ss.port = port; // check
        server.ss = tls.createServer(getOptions(), (socket) => {
            if (server.permitUnauthorized() || socket.authorized) {
                if (socket.authorized) {
                    logger.log("server", "{connected}", "Connection authorized by a CA.");
                }
                else {
                    logger.log("server", "{connected}", "Connection didn't authorized by a CA.");
                }
                const peer = {
                    host: socket.remoteAddress,
                    port: socket.remotePort,
                };
                connection.onConnect(socket, peer);
            }
            else {
                return logger.log("server", "Connection not authorized: " + socket.authorizationError);
            }
            socket.on("close", () => {
                connection.onClose(socket);
            });
            socket.on("error", (e) => {
                logger.warn("server", "socket server error 1", e);
            });
            // add onEnd
        });
        const host = "0.0.0.0"; // temp
        server.ss.listen(port, host, () => {
            logger.info("server", `TLS socket is listening on ${host}:${port}`);
            setTimeout(() => {
                const { user: { id: user_id }, node: { id: node_id }, } = store;
                const card = {
                    type: "dogma-router",
                    user_id,
                    node_id,
                    port,
                };
                LocalDiscovery.announce(card);
                dht.announce(port);
            }, 3000);
            emit("server", STATES.LIMITED);
        });
        server.ss.on("error", (error) => {
            emit("server", STATES.ERROR);
            logger.error("server", "SERVER ERROR", error);
        });
        server.ss.on("close", () => {
            logger.log("server", "SOCKET SERVER CLOSED");
        });
    },
    /**
     *
     * @param {Function} cb
     */
    stop: (cb) => {
        // if (server.service && server.service.stop) server.service.stop();
        emit("server", STATES.DISABLED);
        server.ss.close();
        cb();
    },
    /**
     *
     * @param {Number} port new port
     */
    refresh: (port) => {
        if (port != server.ss.port) {
            server.stop(() => {
                server.listen(port);
            });
        }
        else {
            server.ss.setSecureContext(getOptions());
        }
    },
    /**
     * Allows unauthorized server connections
     * @returns {Boolean}
     * @todo check how args.discovery allows ALL permission
     */
    permitUnauthorized: () => {
        const cond1 = !!args.discovery;
        const cond2 = state["config-bootstrap"] == DHTPERM.ALL;
        return cond1 || cond2;
    },
});
subscribe(["server"], (_action, state) => {
    services.router = state;
});
subscribe(["server", "config-autoDefine", "config-external", "config-public_ipv4"], (_action, _state) => {
    const state = services.router;
    switch (state) {
        case STATES.LIMITED:
            connectionTester.check();
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
