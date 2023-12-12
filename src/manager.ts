import http from "node:http";
import Router from "./manager/router";
import logger from "./modules/logger";

process.title = "Dogma Meta Manager";

export default function RunManager(port: number = 24600) {
  const server = http.createServer(Router);
  server.on("clientError", (err, socket) => {
    socket.end("HTTP/1.1 400 Bad Request\r\n\r\n");
  });
  server.listen(port);
  server.on("listening", () => {
    logger.info("API", `REST API is listening on [http://localhost:${port}]`);
  });
  return server;
}
