import * as Types from "../../types";
import logger from "../logger";
import DogmaSocket from "../socket";

export default function onData(
  this: DogmaSocket,
  result: Types.Streams.DemuxedResult
) {
  const { mx, data } = result;
  switch (mx) {
    case Types.Streams.MX.handshake:
      this.handleHandshake(data);
      break;
    case Types.Streams.MX.test:
      this.handleTest(data);
      break;
    case Types.Streams.MX.dht:
    case Types.Streams.MX.control:
    case Types.Streams.MX.messages:
    case Types.Streams.MX.mail:
    case Types.Streams.MX.web:
    case Types.Streams.MX.file:
      this.emit("data", result);
      break;
    default:
      logger.warn("onData", "unknown MX", mx);
      break;
  }
}
