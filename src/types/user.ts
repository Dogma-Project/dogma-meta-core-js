import Sync from "./sync";

declare namespace User {
  export type Id = string;
  export type Name = string;
  export type Model = {
    user_id: Id;
    name: string;
    avatar?: string;
    sync_id?: Sync.Id;
  };
  export type Storage = {
    id: Id | null;
    name: Name;
    privateKey: Buffer | null;
    publicKey: Buffer | null;
  };
}

export default User;
