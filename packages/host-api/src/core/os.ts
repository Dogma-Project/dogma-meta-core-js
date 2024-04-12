import os from "node:os";

const HostOperatingSystem = {
  homedir: () => {
    return os.homedir();
  },
  networkInterfaces: () => {
    return os.networkInterfaces();
  },
};

export default HostOperatingSystem;
