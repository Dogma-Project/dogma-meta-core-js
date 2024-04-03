import * as Types from "../../types";
import logger from "../logger";
import DogmaSocket from "../socket";
import { C_Streams } from "../../types/constants";

export default function onData(
  this: DogmaSocket,
  result: Types.Streams.DemuxedResult
) {
  const { mx, data } = result;
  switch (mx) {
    case C_Streams.MX.handshake:
      this.handleHandshake(data);
      break;
    case C_Streams.MX.key:
      this.handleSymmetricKey(data);
      break;
    case C_Streams.MX.test:
      this.handleTest(data);
      break;
    case C_Streams.MX.dht:
    case C_Streams.MX.control:
    case C_Streams.MX.messages:
    case C_Streams.MX.mail:
    case C_Streams.MX.web:
    case C_Streams.MX.file:
    case C_Streams.MX.sync:
    case C_Streams.MX.relay:
      this.emit("data", result);
      break;
    default:
      logger.warn("onData", "unknown MX", mx);
      break;
  }
}
