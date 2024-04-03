import { Sync } from "./sync";

export namespace User {
  export type Id = string;
  export type Name = string;

  export interface ExportModel {
    name: string;
    avatar?: string;
  }

  export interface Model extends ExportModel {
    [index: string | symbol]:
      | Id
      | string
      | Sync.Id
      | boolean
      | undefined
      | number;
    user_id: Id;
    requested?: true;
  }

  export type Storage = {
    id: Id | null;
    name: Name;
    privateKey: Buffer | null;
    publicKey: Buffer | null;
  };
}
