import { nodeModel } from "../../../../components/model";
import { Node } from "../../../../types";

export default function EditNode(params: Node.Model) {
  if (!params || !params.user_id || !params.node_id)
    return Promise.reject("Params not defined");

  const query: Node.Model = {
    user_id: params.user_id,
    node_id: params.node_id,
    name: params.name,
  };

  return nodeModel.persistNode(query);
}
