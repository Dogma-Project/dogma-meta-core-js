'use strict';

var os = require('os');
var ifaces = os.networkInterfaces();

module.exports = () => { 
    var array = [];
    Object.keys(ifaces).forEach((ifname) => {
        ifaces[ifname].forEach((iface) => {
            if ('IPv4' !== iface.family || iface.internal !== false) return;
            array.push(iface.address);
        });
    });
    return array;
}

