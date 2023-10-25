import * as Types from "../../types";
import Connections from "../connections";
import DogmaSocket from "../socket";
export default function getConnectionByNodeId(this: Connections, node_id: Types.Node.Id): DogmaSocket | null;
