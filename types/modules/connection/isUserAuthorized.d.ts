import ConnectionClass from "../connections";
export default function isUserAuthorized(this: ConnectionClass, user_id: string): Promise<boolean | null>;
