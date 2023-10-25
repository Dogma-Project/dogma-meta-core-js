import Sync from "./sync";

declare namespace User {
  export type Id = string;
  export type Model = {
    user_id: Id;
    name: string;
    avatar?: string;
    sync_id?: Sync.Id;
  };
}

export default User;
