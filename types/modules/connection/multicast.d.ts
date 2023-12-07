import * as Types from "../../types";
import Connections from "../connections";
import { C_Connection } from "@dogma-project/constants-meta";
export default function multicast(this: Connections, request: Types.Request, destination: C_Connection.Group): void;
