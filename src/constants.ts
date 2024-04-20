import { Connection } from "./constants/connection";
import { Defaults } from "./constants/defaults";
import { Constants } from "./constants/constants";
import { DHT } from "./constants/dht";
import { Event } from "./constants/event";
import { Keys } from "./constants/keys";
import { System } from "./constants/system";
import { Message } from "./constants/message";
import { Sync } from "./constants/sync";
import { Streams } from "./constants/streams";
import { API } from "./constants/api";

/**
 * @constant
 */
export const PROTOCOL = {
  DB: 1,
  CERTIFICATE: 0,
  CONNECTION: 3,
} as const;

export {
  Connection as C_Connection,
  Defaults as C_Defaults,
  Constants as C_Constants,
  DHT as C_DHT,
  Event as C_Event,
  Keys as C_Keys,
  System as C_System,
  Message as C_Message,
  Sync as C_Sync,
  Streams as C_Streams,
  API as C_API,
};
