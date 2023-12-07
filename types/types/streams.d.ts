/// <reference types="node" />
import DogmaSocket from "../modules/socket";
import { C_Streams } from "@dogma-project/constants-meta";
export declare namespace Streams {
    type DemuxedResult = {
        mx: C_Streams.MX;
        data: Buffer;
        descriptor?: string;
    };
    type DataHandler = (data: Buffer, socket: DogmaSocket, descriptor?: string) => void;
}
