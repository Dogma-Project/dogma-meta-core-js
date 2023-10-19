import { Types } from "../../types";
import ConnectionClass from "../connection";
export default function send(this: ConnectionClass, user_id: Types.User.Id, message: Types.Message.Class.Abstract): Promise<void>;
