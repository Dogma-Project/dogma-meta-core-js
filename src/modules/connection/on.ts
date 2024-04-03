import ConnectionClass from "../connections";
import { Streams } from "../../types";

/**
 * Sets data handlers for various MX types. Can set just once;
 * @param this
 * @param event MX
 * @param handler function - handler
 */
export default function on(
  this: ConnectionClass,
  event: Streams.MX,
  handler: Streams.DataHandler
) {
  this.handlers[event] = handler;
}
