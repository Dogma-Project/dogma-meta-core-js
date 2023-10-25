/// <reference types="node" />
declare namespace Streams {
    enum MX {
        dummy,
        handshake,
        test,
        control,
        messages,
        mail,
        dht
    }
    type DemuxedResult = {
        mx: MX;
        data: Buffer;
        descriptor?: string;
    };
}
export default Streams;
