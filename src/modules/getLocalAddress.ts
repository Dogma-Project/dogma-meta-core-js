import os from "node:os";

const ifaces = os.networkInterfaces();

/**
 * @todo fix
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
