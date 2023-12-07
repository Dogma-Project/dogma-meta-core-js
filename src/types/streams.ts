import DogmaSocket from "../modules/socket";
import { C_Streams } from "@dogma-project/constants-meta";

export namespace Streams {
  export type DemuxedResult = {
    mx: C_Streams.MX;
    data: Buffer;
    descriptor?: string; // edit
  };

  export type DataHandler = (
    data: Buffer,
    socket: DogmaSocket,
    descriptor?: string
  ) => void;
}
