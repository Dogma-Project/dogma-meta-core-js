/// <reference types="node" />
declare namespace Streams {
    const enum MX {
        dummy = 0,
        handshake = 1,
        test = 2,
        control = 3,
        messages = 4,
        mail = 5,
        dht = 6
    }
    type DemuxedResult = {
        mx: MX;
        data: Buffer;
        descriptor?: string;
    };
    const enum SIZES {
        MX = 1,
        LEN = 2
    }
}
export default Streams;
