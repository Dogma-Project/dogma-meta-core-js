import DogmaSocket from "../modules/socket";
import { C_Streams } from "../constants";
import { ValuesOf } from "./_main";

export namespace Streams {
  export type MX = ValuesOf<typeof C_Streams.MX>;

  export type DemuxedResult = {
    mx: MX;
    data: Buffer;
    descriptor?: string; // edit
  };

  export type DataHandler = (
    data: Buffer,
    socket: DogmaSocket,
    descriptor?: string
  ) => void;
}
