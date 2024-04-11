import internal from "node:stream";
import crypto from "node:crypto";
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

  export namespace Encode {
    export type AESParams = {
      id: number;
      symmetricKey: Buffer;
      opts?: internal.TransformOptions | undefined;
    };
    export type RSAParams = {
      id: number;
      publicKey: crypto.KeyLike;
      opts?: internal.TransformOptions | undefined;
    };
    export type PlainParams = {
      id: number;
      opts?: internal.TransformOptions | undefined;
    };
  }

  export type BufferToStreamParams = {
    buffer: Buffer;
    chunkSize: number;
    opts?: internal.ReadableOptions | undefined;
  };
}
