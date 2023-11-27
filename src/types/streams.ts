import DogmaSocket from "../modules/socket";

export namespace Streams {
  export enum MX {
    dummy = 0,
    handshake = 1,
    test = 2,
    control = 3,
    messages = 4,
    mail = 5,
    dht = 6,
    web = 7,
    file = 8,
    relay = 9,
  }
  export type DemuxedResult = {
    mx: MX;
    data: Buffer;
    descriptor?: string; // edit
  };
  export enum SIZES {
    MX = 1,
    LEN = 2,
  }
  export type DataHandler = (
    data: Buffer,
    socket: DogmaSocket,
    descriptor?: string
  ) => void;
}
