"use strict";
subscribe(["master-key"], () => {
    services.masterKey = STATES.FULL;
});
subscribe(["node-key"], () => {
    services.nodeKey = STATES.FULL;
});
/**
 *
 */
const getKeys = () => {
    if (!store.user.key) {
        try {
            store.user.key = fs.readFileSync(keysDir + "/key.pem");
            store.user.cert = fs.readFileSync(keysDir + "/cert.pem");
            const id = crypt.getPublicCertHash(store.user.cert.toString()); // edit
            if (id === undefined)
                throw "unknown cert"; // edit
            store.user.id = id;
            emit("master-key", store.user);
        }
        catch (e) {
            logger.log("store", "MASTER KEYS NOT FOUND");
            services.masterKey = STATES.READY; // edit
        }
        /** @todo check result! */
        if (services.masterKey === STATES.READY && args.auto)
            generateMasterKeys(store, {
                name: args.master || DEFAULTS.USER_NAME,
                keylength: 2048, // edit
            });
    }
    if (!store.node.key) {
        try {
            store.node.key = fs.readFileSync(keysDir + "/node-key.pem");
            store.node.cert = fs.readFileSync(keysDir + "/node-cert.pem");
            const id = crypt.getPublicCertHash(store.node.cert.toString());
            if (id === undefined)
                throw "unknown cert";
            store.node.id = id;
            const names = crypt.getNamesFromNodeCert(store.node.cert.toString());
            store.user.name = names.user_name;
            store.node.name = names.node_name;
            emit("node-key", store.node);
        }
        catch (e) {
            logger.log("store", "NODE KEYS NOT FOUND");
            services.nodeKey = STATES.READY; // edit
        }
        /** @todo check result! */
        if (services.nodeKey === STATES.READY && args.auto)
            generateNodeKeys(store, {
                name: args.node || DEFAULTS.NODE_NAME,
                keylength: 2048,
            });
    }
};
