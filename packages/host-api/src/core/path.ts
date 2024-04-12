import path from "node:path";

const HostPath = {
  join: (...paths: string[]) => {
    return path.join(...paths);
  },
};

export default HostPath;
