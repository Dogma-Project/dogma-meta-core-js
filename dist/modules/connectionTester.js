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
const { store } = require("./store");
const { emit } = require("./state");
//
const logger = require("../logger");
//
const { Node } = require("./model");
//
const { test } = require("./client");
const { STATES } = require("./constants");
/** @module ConnectionTester */
/**
 *
 * @returns {Promise}
 */
const getExternalIp4 = () => {
    return new Promise((resolve, reject) => {
        try {
            var extServices = store.config.external.split("\n").map((item) => {
                return item.trim();
            });
            var extIP = require("ext-ip")({
                mode: "parallel",
                replace: true,
                timeout: 500,
                userAgent: "curl/ext-ip-getter",
                followRedirect: true,
                maxRedirects: 10,
                services: extServices
            });
        }
        catch (err) {
            return reject(err);
        }
        extIP.get().then(resolve).catch(error => {
            if (store.node.public_ipv4 && store.node.public_ipv4 !== '127.0.0.1') {
                resolve(store.node.public_ipv4);
            }
            else {
                logger.error("connection tester", error);
                reject("can't get public ip");
            }
        });
    });
};
/**
 *
 * @param {String} ip
 * @returns {Promise}
 * @todo add config update
 */
const testExternalIp4 = (ip) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (store.node.public_ipv4 === ip) {
            return true;
        }
        else {
            const result = yield Node.setNodePublicIPv4(store.node.id, ip);
            logger.log("connection tester", "external public_ipv4 saved", result);
            store.node.public_ipv4 = ip;
            return true;
        }
    }
    catch (err) {
        return Promise.reject(err);
    }
});
/**
 *
 */
const testExternalPort = () => {
    const peer = {
        host: store.node.public_ipv4,
        port: store.config.router
    };
    test(peer, result => {
        if (result) {
            emit("server", STATES.FULL);
        }
        else {
            emit("server", STATES.LIMITED);
            logger.log("connection tester", "router external port is closed");
        }
    });
};
/**
 *
 */
module.exports.check = () => {
    if (store.config.autoDefine) {
        getExternalIp4().then(testExternalIp4).then(testExternalPort).catch((error) => {
            logger.error("connection tester", error);
        });
    }
    else {
        if (!!store.config.public_ipv4) {
            testExternalIp4(store.config.public_ipv4).then(testExternalPort).catch((error) => {
                logger.error("connection tester", error);
            });
        }
        else {
            logger.warn("connection tester", "undefined public_ipv4");
        }
    }
};
