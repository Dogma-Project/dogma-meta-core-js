import os from "node:os";

const ifaces = os.networkInterfaces();

/**
 * @module GetLocalAddress
 * @param {String} family default: IPv4
 * @returns {Array} array of ip's
 */
export const getLocalAddress = (family = "IPv4") => {
  // edit
  let array: any[] = [];
  Object.keys(ifaces).forEach((ifname) => {
    ifaces[ifname].forEach((iface) => {
      if (iface.family !== family || iface.internal !== false) return;
      array.push(iface);
    });
  });
  return array;
};
