import logger from "../../libs/logger";
import { Types } from "../../types";

const reject = (socket: Types.Connection.Socket, ...message: any) => {
  socket.destroy();
  logger.error("connection", ...message);
};

export default reject;
