import Client from "../modules/client";
import connections from "./connections";
import localDiscovery from "./localDiscovery";
import logger from "../modules/logger";
import dht from "./dht";
import { Types } from "../types";
import storage from "./storage";
import state from "./state";
import args from "../modules/arguments";
import eventEmitter from "./eventEmitter";

const client = new Client({ connections, state, storage });

localDiscovery.on("candidate", (data: Types.Discovery.Candidate) => {
  const { type, user_id, node_id, local_ipv4 } = data;
  logger.log("client", "Local discovery candidate", data);
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

state.subscribe(["update-user", "users"], () => {
  const user_id = state.state["update-user"];
  connections.closeConnectionsByUserId(user_id);
});

state.subscribe(["nodes", "users", "nodes", "node-key"], () => {
  // edit
  eventEmitter.emit("friends", true);
  if (args.discovery) return; // don't lookup in discovery mode
  clearInterval(connectFriendsInterval);
  client.connectFriends(); // check
  connectFriendsInterval = setInterval(client.connectFriends, 60000); // edit
});

state.subscribe(["config-dhtLookup", "users", "node-key"], () => {
  // edit
  if (args.discovery) return; // don't lookup in discovery mode
  clearInterval(searchFriendsInterval);
  if (storage.config.dhtLookup) {
    client.searchFriends(); // check
    searchFriendsInterval = setInterval(client.searchFriends, 30000); // edit
  }
});
