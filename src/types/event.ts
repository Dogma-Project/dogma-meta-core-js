import { C_System, C_Event } from "./constants";

export namespace Event {
  export type Payload = any[];

  export type ServicesList = {
    service: C_Event.Type.Service;
    state: C_System.States;
  }[];
}
