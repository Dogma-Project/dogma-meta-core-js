import { ValuesOf } from "./_main";
import { C_System } from "../constants";
export namespace System {
  export type LogLevel = ValuesOf<typeof C_System.LogLevel>;
}
