const multiplex = require("multiplex");
import net from "node:net";
import logger from "../../libs/logger";
import { MX } from "../../constants";
import { EncodeStream } from "../streams";
import generateSyncId from "../../libs/generateSyncId";
import { Types } from "../../types";
import ConnectionClass from "../connection";

export default function onConnect(
  this: ConnectionClass,
  socket: net.Socket,
  peer: Types.Connection.Peer
) {
  const connection = this; // edit

  /**
   *
   * @param {Stream} writable
   * @return {Stream} transformable // check
   */
  const initEncoder = (writable) => {
    let encoder = new EncodeStream({
      highWaterMark: connection.highWaterMark,
      descriptor: "0",
    }); // edit
    encoder.on("error", (err) => logger.error("encoder error", err));
    encoder.pipe(writable);
    return encoder;
  };

  const address = peer.host + ":" + peer.port;
  const connection_id = generateSyncId(6);
  logger.info("connection", "connected", connection_id, address);

  const dogmaPlex = multiplex((stream, id) => {
    id = Number(id);
    // const decoder = new DecodeStream({ highWaterMark: connection.highWaterMark });
    stream.on("error", (err) =>
      logger.error("connection", "stream decode error", err)
    );
    stream.on("data", (data) => connection.onData({ socket, data, id }));
  });

  socket.multiplex = {};

  // substreams
  socket.multiplex.control = initEncoder(dogmaPlex.createStream(MX.CONTROL));
  socket.multiplex.messages = initEncoder(dogmaPlex.createStream(MX.MESSAGES));
  socket.multiplex.files = dogmaPlex.createStream(MX.FILES);
  socket.multiplex.dht = initEncoder(dogmaPlex.createStream(MX.DHT));

  // add more
  dogmaPlex.pipe(socket);
  socket.pipe(dogmaPlex);
  connection.peers[connection_id] = socket;

  try {
    const peerIdentity = socket.getPeerCertificate(true);
    const user_id = peerIdentity.issuerCertificate.fingerprint256.toPlainHex();
    const node_id = peerIdentity.fingerprint256.toPlainHex();
    socket.dogma = {
      connection_id,
      address,
      user_id,
      node_id,
    };
    connection.accept(socket);
  } catch (err) {
    return connection.reject(socket, "socket.getPeerCertificate::", err);
  }
}
