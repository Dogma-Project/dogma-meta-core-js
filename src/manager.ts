import http from "node:http";
import Router from "./manager/router";
import logger from "./modules/logger";
import CheckPort from "./modules/portChecker";

process.title = "Dogma Meta Manager";

export default async function RunManager(port: number = 24600) {
  try {
    let open = false;
    do {
      open = await CheckPort(port);
      if (!open) {
        logger.warn("API", `Port ${port} is busy. checking next...`);
        port++;
      } else {
        logger.warn("API", `Port ${port} is open`);
      }
    } while (!open);
    const server = http.createServer(Router);
    server.on("clientError", (err, socket) => {
      socket.end("HTTP/1.1 400 Bad Request\r\n\r\n");
    });
    server.listen(port);
    server.on("listening", () => {
      logger.info("API", `REST API is listening on [http://localhost:${port}]`);
    });

    return port;
  } catch (err) {
    logger.error("Manager", err);
    Promise.reject(err);
  }
}
