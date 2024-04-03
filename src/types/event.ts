import { C_System, C_Event } from "../constants";
import { ValuesOf } from "./_main";

export namespace Event {
  export type Payload = any[];

  export type ServiceState = ValuesOf<typeof C_System.States>;

  export type ServicesList = {
    service: C_Event.Type.Service;
    state: ValuesOf<typeof C_System.States>;
  }[];
}
