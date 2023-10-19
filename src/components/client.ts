LocalDiscovery.on("message", (data) => {
  // validate
  const {
    msg: { type, user_id, node_id, port },
    from: { address },
  } = data;
  logger.log("client", "Local discovery candidate", data);
  if (type && type == "dogma-router" && user_id && node_id) {
    logger.log("nodes", "trying to connect local service", address);
    client.tryPeer(
      {
        host: address,
        port,
      },
      {
        user_id,
        node_id,
      }
    );
  }
});

dht.on("peers", (data: Types.DHT.RequestData.LookupAnswerData[]) => {
  // check types
  data.forEach((item) => {
    const { public_ipv4, port, user_id, node_id } = item;
    client.tryPeer(
      {
        host: public_ipv4,
        port,
      },
      {
        user_id,
        node_id,
      }
    );
  });
});

let connectFriendsInterval: NodeJS.Timer | undefined;
let searchFriendsInterval: NodeJS.Timer | undefined;

subscribe(["update-user", "users"], () => {
  const user_id = state["update-user"];
  connection.closeConnectionsByUserId(user_id);
});

subscribe(["nodes", "users", "nodes", "node-key"], () => {
  // edit
  EventEmitter.emit("friends", true);
  if (args.discovery) return; // don't lookup in discovery mode
  clearInterval(connectFriendsInterval);
  client.connectFriends(); // check
  connectFriendsInterval = setInterval(client.connectFriends, 60000); // edit
});

subscribe(["config-dhtLookup", "users", "node-key"], () => {
  // edit
  if (args.discovery) return; // don't lookup in discovery mode
  clearInterval(searchFriendsInterval);
  if (store.config.dhtLookup) {
    client.searchFriends(); // check
    searchFriendsInterval = setInterval(client.searchFriends, 30000); // edit
  }
});
