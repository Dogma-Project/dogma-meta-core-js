import Sync from "./sync";
declare namespace User {
    type Id = string;
    type Model = {
        user_id: Id;
        name: string;
        avatar?: string;
        sync_id?: Sync.Id;
    };
}
export default User;
