import events from "node:events";

import {
  MakeDirectoryOptions,
  Mode,
  ObjectEncodingOptions,
  OpenMode,
  PathLike,
  RmOptions,
} from "node:fs";
import fs, { FileHandle } from "node:fs/promises";
import { Stream } from "node:stream";

const HostFilesystem = {
  /**
   * @todo edit options
   * @param path
   * @returns
   */
  readFile: (
    path: PathLike | FileHandle,
    options?:
      | ({
          encoding?: null | undefined;
          flag?: OpenMode | undefined;
        } & events.Abortable)
      | null
  ) => {
    return fs.readFile(path, options);
  },
  rm: (path: PathLike, options?: RmOptions) => {
    return fs.rm(path, options);
  },
  access: (path: PathLike, mode?: number) => {
    return fs.access(path, mode);
  },
  mkdir: (
    path: PathLike,
    options: MakeDirectoryOptions & {
      recursive: true;
    }
  ) => {
    return fs.mkdir(path, options);
  },
  writeFile: (
    file: PathLike | FileHandle,
    data:
      | string
      | NodeJS.ArrayBufferView
      | Iterable<string | NodeJS.ArrayBufferView>
      | AsyncIterable<string | NodeJS.ArrayBufferView>
      | Stream,
    options?:
      | (ObjectEncodingOptions & {
          mode?: Mode | undefined;
          flag?: OpenMode | undefined;
          /**
           * If all data is successfully written to the file, and `flush`
           * is `true`, `filehandle.sync()` is used to flush the data.
           * @default false
           */
          flush?: boolean | undefined;
        } & events.Abortable)
      | BufferEncoding
      | null
  ) => {
    return fs.writeFile(file, data, options);
  },
} as const;

export default HostFilesystem;
