import storage from "../../../../components/storage";
import { nodeModel } from "../../../../components/model";
import { Certificate } from "../../../../types";
import { Buffer } from "node:buffer";

export default async function getCertificate() {
  try {
    if (storage.user.id && storage.node.id) {
      const exportData: Certificate.ExportFormat = {
        user_id: storage.user.id,
      };
      const node = await nodeModel.get(storage.user.id, storage.node.id, true);
      if (node) exportData.node = node;
      return Buffer.from(JSON.stringify(exportData)).toString("base64");
    }
    return Promise.reject(null); // edit
  } catch (err) {
    return Promise.reject(err);
  }
}
