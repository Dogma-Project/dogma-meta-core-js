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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("./main");
const state_old_1 = require("./state-old");
const logger_1 = __importDefault(require("./logger"));
const model_1 = require("./model");
const client_1 = require("./client");
const constants_1 = require("../constants");
/** @module ConnectionTester */
const getExternalIp4 = () => {
    return new Promise((resolve, reject) => {
        try {
            var extServices = main_1.store.config.external.split("\n").map((item) => {
                return item.trim();
            });
            var extIP = require("ext-ip")({
                mode: "parallel",
                replace: true,
                timeout: 500,
                userAgent: "curl/ext-ip-getter",
                followRedirect: true,
                maxRedirects: 10,
                services: extServices,
            });
        }
        catch (err) {
            return reject(err);
        }
        extIP
            .get()
            .then(resolve)
            .catch((error) => {
            if (main_1.store.node.public_ipv4 && main_1.store.node.public_ipv4 !== "127.0.0.1") {
                resolve(main_1.store.node.public_ipv4);
            }
            else {
                logger_1.default.error("connection tester", error);
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
        if (main_1.store.node.public_ipv4 === ip) {
            return true;
        }
        else {
            const result = yield model_1.Node.setNodePublicIPv4(main_1.store.node.id, ip);
            logger_1.default.log("connection tester", "external public_ipv4 saved", result);
            main_1.store.node.public_ipv4 = ip;
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
        host: main_1.store.node.public_ipv4,
        port: main_1.store.config.router,
    };
    (0, client_1.test)(peer, (result) => {
        if (result) {
            (0, state_old_1.emit)("server", constants_1.STATES.FULL);
        }
        else {
            (0, state_old_1.emit)("server", constants_1.STATES.LIMITED);
            logger_1.default.log("connection tester", "router external port is closed");
        }
    });
};
const check = () => {
    if (main_1.store.config.autoDefine) {
        getExternalIp4()
            .then(testExternalIp4)
            .then(testExternalPort)
            .catch((error) => {
            logger_1.default.error("connection tester", error);
        });
    }
    else {
        if (!!main_1.store.config.public_ipv4) {
            testExternalIp4(main_1.store.config.public_ipv4)
                .then(testExternalPort)
                .catch((error) => {
                logger_1.default.error("connection tester", error);
            });
        }
        else {
            logger_1.default.warn("connection tester", "undefined public_ipv4");
        }
    }
};
exports.default = check;
