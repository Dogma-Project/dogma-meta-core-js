import http from "node:http";
import Router from "./manager/router";
import logger from "./modules/logger";
import CheckPort from "./modules/portChecker";

process.title = "Dogma Meta Manager";

export default async function RunManager(port: number = 24600) {
  try {
    const open = await CheckPort(port);
    if (!open) return RunManager(port + 1);
    const server = http.createServer(Router);
    server.on("clientError", (err, socket) => {
      socket.end("HTTP/1.1 400 Bad Request\r\n\r\n");
    });
    server.listen(port);
    server.on("listening", () => {
      logger.info("API", `REST API is listening on [http://localhost:${port}]`);
    });

    return server;
  } catch (err) {
    logger.error("Manager", err);
  }
}
