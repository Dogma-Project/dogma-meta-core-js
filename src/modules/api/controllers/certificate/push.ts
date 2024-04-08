import { userModel, nodeModel } from "../../../../components/model";
import { Node } from "../../../../types";

/**
 * @todo add validations
 * @param cert
 * @returns
 */
export default async function pushCertificate(cert: string): Promise<true> {
  try {
    if (cert) {
      const str = Buffer.from(cert, "base64").toString();
      const parsed = JSON.parse(str) as any;
      if ("user_id" in parsed) {
        const user_id = parsed.user_id as string;
        // validate user_id
        await userModel.persistUser({ user_id });
        if ("node" in parsed) {
          // validate node
          const node = parsed.node as Node.ExportModel;
          await nodeModel.persistNode({ user_id, ...node });
        }
        return true;
      }
    }
    return Promise.reject(null); // edit
  } catch (err) {
    return Promise.reject(err);
  }
}
