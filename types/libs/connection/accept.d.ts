import { Types } from "../../types";
import ConnectionClass from "../connection";
/**
 *
 * @param {Object} socket connection
 */
export default function accept(this: ConnectionClass, socket: Types.Connection.Socket): Promise<void>;
