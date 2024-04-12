import { worker } from "@dogma-project/core-host-api";
import Client from "../modules/client";
import connections from "./connections";
import localDiscovery from "./localDiscovery";
import logger from "../modules/logger";
import dht from "./dht";
import * as Types from "../types";
import storage from "./storage";
import state from "./state";
import { C_Event, C_Sync, C_System } from "../constants";
import { userModel, nodeModel } from "./model";

const models: Types.Model.All = {};
models[C_Sync.Type.nodes] = nodeModel;
models[C_Sync.Type.users] = userModel;

const client = new Client({ connections, state, storage, models });

localDiscovery.on("candidate", (data: Types.Discovery.Candidate) => {
  const { type, user_id, node_id, local_ipv4 } = data;
  logger.log("client", "Local discovery candidate", data.local_ipv4); // edit
  if (type && type == "dogma-router" && user_id && node_id) {
    logger.log("nodes", "Try to connect local service", local_ipv4);
    const peer = connections.peerFromIP(local_ipv4);
    client.tryPeer(peer, { user_id, node_id });
  }
});
dht.on("peers", (data: Types.DHT.LookUp.Answer.Data[]) => {
  data.forEach((item) => {
    const { public_ipv4, user_id, node_id } = item;
    const peer = connections.peerFromIP(public_ipv4);
    client.tryPeer(peer, { user_id, node_id });
  });
});

let connectFriendsInterval: NodeJS.Timeout | undefined;
let searchFriendsInterval: NodeJS.Timeout | undefined;

if (!worker.workerData.discovery) {
  /**
   * Try to connect friends
   */
  state.subscribe(
    [C_Event.Type.usersDb, C_Event.Type.nodesDb, C_Event.Type.nodeKey], // change to server
    ([usersDb, nodesDb, nodeKey]) => {
      connectFriendsInterval && clearInterval(connectFriendsInterval);
      connectFriendsInterval = setInterval(() => {
        if (nodesDb === C_System.States.full) {
          client.connectFriends().catch(console.error);
        }
      }, 45000); // edit
    }
  );

  /**
   * search friends by DHT
   */
  //
  state.subscribe(
    [
      C_Event.Type.configDhtLookup,
      C_Event.Type.usersDb,
      C_Event.Type.dhtService, // check
    ],
    ([configDhtLookup, usersDb, dhtService]) => {
      searchFriendsInterval && clearInterval(searchFriendsInterval);
      if (configDhtLookup && usersDb === C_System.States.full) {
        searchFriendsInterval = setInterval(async () => {
          try {
            const users = await userModel.getAll();
            if (users.length) {
              logger.log("CLIENT", "Trying to search friends", users.length);
              users.forEach((user: Types.User.Model) => {
                if (!user.requested) dht.lookup(user.user_id);
              });
            }
          } catch (err) {
            logger.error("dht lookup request", err);
          }
        }, 45000); // edit
      }
    }
  );
}

export default client;
