import { Types } from "../../types";
import logger from "../logger";
import DogmaSocket from "../socket";

export default function onData(
  this: DogmaSocket,
  result: Types.Streams.DemuxedResult
) {
  switch (result.mx) {
    case Types.Streams.MX.handshake:
      this.handleHandshake(result.data);
      break;
    case Types.Streams.MX.test:
      this.handleTest(result.data);
      break;
    case Types.Streams.MX.dht:
      this.stateBridge.emit(Types.Event.Type.dataDht, result.data);
      break;
    case Types.Streams.MX.messages:
      this.stateBridge.emit(Types.Event.Type.dataMessages, result.data);
      break;
    default:
      logger.warn("onData", "unknown MX", result.mx);
      break;
  }
}
