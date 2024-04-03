import { C_Defaults } from "../../types/constants";

export default function getRandomPort() {
  const port =
    Math.floor(
      Math.random() * (C_Defaults.maxApiPort - C_Defaults.minApiPort + 1)
    ) + C_Defaults.minApiPort;
  return port;
}
