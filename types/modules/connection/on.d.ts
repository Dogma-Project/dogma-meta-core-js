import ConnectionClass from "../connections";
import { C_Streams } from "@dogma-project/constants-meta";
import { Streams } from "../../types";
/**
 * Sets data handlers for various MX types. Can set just once;
 * @param this
 * @param event MX
 * @param handler function - handler
 */
export default function on(this: ConnectionClass, event: C_Streams.MX, handler: Streams.DataHandler): void;
