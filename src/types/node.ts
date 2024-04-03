import { Connection } from "./connection";
import { User } from "./user";
import { Sync } from "./sync";

export namespace Node {
  export type Id = string;
  export type Name = string;

  export interface ExportModel {
    name: string;
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
    node_id: Node.Id;
    user_id: User.Id;
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
    public_ipv4?: Connection.IPv4;
    local_ipv4?: Connection.IPv4;
  };
}
