import connections from "../../../components/connections";
import { API } from "../../../types";
import storage from "../../../components/storage";
import { nodeModel, userModel } from "../../../components/model";

export async function getNetwork() {
  const own_user_id = storage.user.id;
  const own_node_id = storage.node.id;

  try {
    const users = await userModel.getAll();
    const nodes = await nodeModel.getAll();

    const result: any[] = []; // edit

    users.forEach((user) => {
      result.push({
        id: user.user_id,
        name: user.name,
        current: own_user_id && own_user_id === user.user_id,
        nodes: [],
      });
    });
    nodes.forEach((node) => {
      const user = result.find((u) => u.id === node.user_id);
      if (user)
        user.nodes.push({
          id: node.node_id,
          name: node.name,
          current: own_node_id && own_node_id === node.node_id,
          online: connections.isNodeOnline(node.node_id),
        });
    });
    return result;
  } catch (err) {
    Promise.reject(err);
  }
}

export default function NetworkController(
  this: API.DogmaWebSocket,
  data: API.ApiRequest
) {
  switch (data.action) {
    case API.ApiRequestAction.get:
      getNetwork()
        .then((res) => {
          this.response({
            type: API.ApiRequestType.network,
            action: API.ApiRequestAction.set,
            payload: {
              network: res,
            },
          });
        })
        .catch((err) => {
          // error
        });

      break;
  }
}
