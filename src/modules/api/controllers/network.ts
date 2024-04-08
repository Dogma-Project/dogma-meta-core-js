import connections from "../../../components/connections";
import { API } from "../../../types";
import storage from "../../../components/storage";
import { nodeModel, userModel } from "../../../components/model";
import { C_API } from "../../../constants";
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
        name: user.name || "[User not synced]",
        current: (own_user_id && own_user_id === user.user_id) || false,
        requested: !!user.requested || undefined,
        nodes: [],
      });
    });

    /**
     * b,a = 1
     * a,b = -1
     * a,b|b,a = 0
     */
    result.sort((a, b) => {
      if (a.current) return -1;
      if (b.current) return 1;
      return Number(!!a.requested) - Number(!!b.requested); // 1 - 0 | 0 - 1 | 0
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

    /**
     * @todo check
     */
    result.forEach((res) => {
      res.nodes.sort((a, b) => {
        if (a.current) return -1;
        if (b.current) return 1;
        return Number(!!b.online) - Number(!!a.online);
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
