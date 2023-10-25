import * as Types from "../../types";
import Connections from "../connections";
import DogmaSocket from "../socket";
export default function getConnectionsByUserId(this: Connections, user_id: Types.User.Id): DogmaSocket[];
