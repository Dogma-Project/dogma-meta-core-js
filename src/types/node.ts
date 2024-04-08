import { Connection } from "./connection";
import { User } from "./user";
import { Sync } from "./sync";

export namespace Node {
  export type Id = string;
  export type Name = string;

  export interface ExportModel {
    node_id: Node.Id;
    public_ipv4?: Connection.IPv4;
    public_ipv6?: Connection.IPv4;
    tor_addr?: string; // edit
  }

  export interface Model extends ExportModel {
    [index: string | symbol]:
      | Id
      | string
      | Sync.Id
      | boolean
      | undefined
      | number;
    user_id: User.Id;
    name?: string;
    local_ipv4?: Connection.IPv6;
    local_ipv6?: Connection.IPv6;
    /**
     * Timestamp in milliseconds
     */
    updated?: number;
    /**
     * Timestamp in milliseconds
     */
    synced?: number;
  }

  export type Storage = {
    id: Id | null;
    name: Name;
    privateKey: Buffer | null;
    publicKey: Buffer | null;
    router_port: number | null;
    public_ipv4?: Connection.IPv4;
    local_ipv4?: Connection.IPv4;
  };
}
