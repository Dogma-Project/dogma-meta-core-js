import Client from "../modules/client";
import connections from "./connections";
import localDiscovery from "./localDiscovery";
import logger from "../modules/logger";
import dht from "./dht";
import * as Types from "../types";
import storage from "./storage";
import state from "./state";
import { getArg } from "../modules/arguments";

const client = new Client({ connections, state, storage });

localDiscovery.on("candidate", (data: Types.Discovery.Candidate) => {
  const { type, user_id, node_id, local_ipv4 } = data;
  logger.log("client", "Local discovery candidate", data.local_ipv4); // edit
  if (type && type == "dogma-router" && user_id && node_id) {
    logger.log("nodes", "trying to connect local service", local_ipv4);
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

let connectFriendsInterval: NodeJS.Timer | undefined;
let searchFriendsInterval: NodeJS.Timer | undefined;

if (!getArg(Types.System.Args.discovery)) {
  /**
   * Try to connect friends
   */
  state.subscribe(
    [Types.Event.Type.users, Types.Event.Type.nodes, Types.Event.Type.nodeKey],
    ([users, nodes, nodeKey]) => {
      clearInterval(connectFriendsInterval);
      connectFriendsInterval = setInterval(() => {
        client.connectFriends(nodes || []);
      }, 45000); // edit
    }
  );

  /**
   * search friends by DHT
   */
  //
  state.subscribe(
    [
      Types.Event.Type.configDhtLookup,
      Types.Event.Type.users,
      Types.Event.Type.dhtService, // check
    ],
    ([configDhtLookup, users, dhtService]) => {
      clearInterval(searchFriendsInterval);
      if (configDhtLookup) {
        searchFriendsInterval = setInterval(() => {
          if (users && Array.isArray(users)) {
            logger.log("CLIENT", "Trying to search friends", users.length);
            users.forEach((user: Types.User.Model) => dht.lookup(user.user_id));
          }
        }, 45000); // edit
      }
    }
  );
}

export default client;
