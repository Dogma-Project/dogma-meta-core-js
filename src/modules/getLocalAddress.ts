import { os } from "@dogma-project/core-meta-be-node";

/**
 *
 * @param ip "192.168.0.2"
 */
export const convertToBroadcast = (ip: string) => {
  if (ip === "0.0.0.0") return "255.255.255.0"; // fallback
  const iparr = ip.split(".");
  iparr[3] = "255"; // broadcast
  return iparr.join(".");
};

/**
 *
 * @param ip "192.168.0.2"
 */
export const getLocalAddress = (ip: string = "") => {
  const ifaces = os.networkInterfaces();
  const pattern = "192.168.";
  let address, broadcast;
  if (ip.indexOf(pattern) === -1) {
    for (const ifname in ifaces) {
      const iface = ifaces[ifname];
      if (iface) {
        for (const ifname in iface) {
          const inner = iface[ifname];
          if (
            inner.family !== "IPv4" ||
            inner.internal !== false ||
            inner.address.indexOf(pattern) === -1
          ) {
            continue;
          }
          address = inner.address;
        }
      }
    }
    if (!address) {
      console.warn(
        "Local Discovery Lib",
        "can't determine local address. fallback to 0.0.0.0"
      );
      address = "0.0.0.0";
    }
  } else {
    address = ip;
  }
  broadcast = convertToBroadcast(address);
  return { address, broadcast };
};
