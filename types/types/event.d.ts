import { C_System, C_Event } from "@dogma-project/constants-meta";
export declare namespace Event {
    type Payload = any[];
    type ServicesList = {
        service: C_Event.Type.Service;
        state: C_System.States;
    }[];
}
