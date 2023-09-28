"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const logger = require("../../logger");
const { nodes, users, config, protocol } = require("../nedb");
/**
 *
 */
const migrateNodes = () => {
    return new Promise((resolve, reject) => {
        nodes.find({}, (err, data) => {
            if (err)
                return reject(err);
            data.forEach((row) => {
                const { _id, name, hash, user_hash, ip4, router_port, node_id, user_id, public_ipv4 } = row;
                const newRow = {
                    name,
                    node_id: node_id || (hash ? hash.toPlainHex() : "unknown"),
                    user_id: user_id || user_hash,
                    public_ipv4: public_ipv4 || ip4,
                    router_port
                };
                nodes.update({ _id }, newRow, (err, updated) => {
                    if (err)
                        return reject(err);
                    logger.info("migarte-0", "migrated", updated, "rows in nodes table");
                });
            });
            resolve(true);
        });
    });
};
/**
 *
 */
const migrateUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        users.find({}, (err, data) => __awaiter(void 0, void 0, void 0, function* () {
            if (err)
                return reject(err);
            for (const row of data) {
                const { _id, name, hash, cert, type, user_id } = row;
                const newRow = {
                    name,
                    user_id: user_id || hash,
                    cert,
                    type
                };
                try {
                    yield users.updateAsync({ _id }, newRow);
                }
                catch (err) {
                    reject(err);
                    logger.error("migrate-0", "error", err);
                }
            }
            resolve(true);
        }));
    });
});
/**
 * @todo convert ip4 to public_ipv4
 */
const migrateConfig = () => {
    return new Promise((resolve, reject) => {
        config.remove({
            $or: [{ param: "stun" }, { param: "turn" }]
        }, {
            multi: true
        }, (err, _result) => {
            if (err)
                return reject(err);
            config.findOne({ param: "ip4" }, (err, result) => {
                if (err)
                    return reject(err);
                logger.info("MIGRATION", result);
                if (result && result.param) {
                    config.update({ _id: result._id }, {
                        param: "public_ipv4",
                        value: result.value
                    }, (err, result) => {
                        if (err)
                            return reject(err);
                        resolve(result);
                    });
                }
                else {
                    resolve(true);
                }
            });
        });
    });
};
/**
 * @returns {Promise}
 */
module.exports = migrate = (version) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield migrateNodes();
            yield migrateUsers();
            yield migrateConfig();
        }
        catch (err) {
            reject(err);
        }
        protocol.update({ name: "DB" }, { name: "DB", value: version + 1 }, { upsert: true }, (err, result) => {
            if (err)
                reject(err);
            resolve(result);
        });
    }));
};
