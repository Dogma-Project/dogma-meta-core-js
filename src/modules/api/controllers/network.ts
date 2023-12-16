import connections from "../../../components/connections";
import { API } from "../../../types";
import storage from "../../../components/storage";
import { nodeModel, userModel } from "../../../components/model";
import { C_API } from "@dogma-project/constants-meta";
import WorkerApi from "../index";

export async function getNetwork() {
  const own_user_id = storage.user.id;
  const own_node_id = storage.node.id;

  try {
    const users = await userModel.getAll();
    const nodes = await nodeModel.getAll();

    const result: API.NetworkData[] = [];

    users.forEach((user) => {
      result.push({
        id: user.user_id,
        name: user.name,
        current: (own_user_id && own_user_id === user.user_id) || false,
        requested: !!user.requested || undefined,
        nodes: [],
      });
    });
    nodes.forEach((node) => {
      const user = result.find((u) => u.id === node.user_id);
      if (user)
        user.nodes.push({
          id: node.node_id,
          name: node.name || "",
          current: (own_node_id && own_node_id === node.node_id) || false,
          online: connections.isNodeOnline(node.node_id),
        });
    });
    return result;
  } catch (err) {
    return Promise.reject(err);
  }
}

export default function NetworkController(this: WorkerApi, data: API.Request) {
  switch (data.action) {
    case C_API.ApiRequestAction.get:
      // get all friends, nodes and friendship requests
      getNetwork()
        .then((res) => {
          this.response({
            type: C_API.ApiRequestType.network,
            action: C_API.ApiRequestAction.set,
            id: data.id,
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
