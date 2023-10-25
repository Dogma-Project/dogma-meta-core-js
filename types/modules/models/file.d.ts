import * as Types from "../../types";
declare const model: {
    permitFileTransfer({ user_id, file, }: {
        user_id: Types.User.Id;
        file: Types.File.Description;
    }): Promise<any>;
    forbidFileTransfer({ user_id, descriptor, }: {
        user_id: Types.User.Id;
        descriptor: number;
    }): Promise<any>;
    fileTransferAllowed({ user_id, descriptor, }: {
        user_id: Types.User.Id;
        descriptor: number;
    }): Promise<any>;
};
export default model;
