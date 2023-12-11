import { C_System } from "@dogma-project/constants-meta";
import RunWorker from "./run";

const worker = new RunWorker({
  apiPort: Number(process.env.apiport) || 24701,
  prefix: process.env.prefix || "empty-0",
  loglevel: Number(process.env.loglevel) || C_System.LogLevel.debug,
});
