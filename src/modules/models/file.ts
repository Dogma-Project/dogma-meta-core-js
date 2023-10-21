import { fileTransfer as fileTransferDb } from "../nedb";
import { Types } from "../../types";

const model = {
  async permitFileTransfer({
    user_id,
    file,
  }: {
    user_id: Types.User.Id;
    file: Types.File.Description;
  }) {
    const { descriptor, size, pathname } = file;
    return fileTransferDb.updateAsync(
      {
        user_id,
        descriptor,
      },
      {
        $set: {
          user_id,
          descriptor,
          size,
          pathname,
        },
      },
      {
        upsert: true,
      }
    );
  },

  async forbidFileTransfer({
    user_id,
    descriptor,
  }: {
    user_id: Types.User.Id;
    descriptor: number;
  }) {
    return fileTransferDb.removeAsync({ user_id, descriptor }, { multi: true });
  },

  async fileTransferAllowed({
    user_id,
    descriptor,
  }: {
    user_id: Types.User.Id;
    descriptor: number;
  }) {
    return fileTransferDb.findOneAsync({ user_id, descriptor });
  },
};

export default model;
