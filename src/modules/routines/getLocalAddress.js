const os = require('os');
const ifaces = os.networkInterfaces();

/**
 * @module GetLocalAddress
 * @param {String} family default: IPv4
 * @returns {Array} array of ip's
 */
module.exports = (family = "IPv4") => { // edit
    let array = [];
    Object.keys(ifaces).forEach((ifname) => {
        ifaces[ifname].forEach((iface) => {
            if (iface.family !== family || iface.internal !== false) return;
            array.push(iface);
        });
    });
    return array;
}