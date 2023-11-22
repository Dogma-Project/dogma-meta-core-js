declare namespace Streams {
  export const enum MX {
    dummy, // edit
    handshake,
    test,
    control,
    messages,
    mail,
    dht,
  }
  export type DemuxedResult = {
    mx: MX;
    data: Buffer;
    descriptor?: string; // edit
  };
  export const enum SIZES {
    MX = 1,
    LEN = 2,
  }
}

export default Streams;
