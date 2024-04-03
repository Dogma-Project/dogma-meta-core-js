import { C_API } from "../../../constants";
import { API } from "../../../types";
import logger from "../../logger";
import WorkerApi from "../index";
import GetUser from "./user/get";
import DeleteUser from "./user/del";
import EditUser from "./user/edit";

export default function UserController(this: WorkerApi, data: API.Request) {
  logger.debug("API", "[USER]", data);
  switch (data.action) {
    case C_API.ApiRequestAction.get:
      // get user by user_id or own
      GetUser(data.payload)
        .then((res) => {
          this.response({
            type: C_API.ApiRequestType.user,
            action: C_API.ApiRequestAction.result,
            id: data.id,
            payload: res,
          });
        })
        .catch((err) => {
          logger.error("API USER", err);
          this.error({
            type: C_API.ApiRequestType.user,
            action: C_API.ApiRequestAction.error,
            id: data.id,
            payload: err,
          });
        });
      break;
    case C_API.ApiRequestAction.set:
      // update user data by user_id
      EditUser(data.payload)
        .then(({ numAffected }) => {
          this.response({
            type: C_API.ApiRequestType.user,
            action: C_API.ApiRequestAction.result,
            id: data.id,
            payload: {
              edited: numAffected,
            },
          });
        })
        .catch((err) => {
          logger.error("API USER", err);
          this.error({
            type: C_API.ApiRequestType.user,
            action: C_API.ApiRequestAction.error,
            id: data.id,
            payload: err,
          });
        });
      break;
    case C_API.ApiRequestAction.delete:
      DeleteUser(data.payload)
        .then(({ numAffected }) => {
          this.response({
            type: C_API.ApiRequestType.user,
            action: C_API.ApiRequestAction.result,
            id: data.id,
            payload: {
              deleted: numAffected,
            },
          });
        })
        .catch((err) => {
          logger.error("API USER", err);
          this.error({
            type: C_API.ApiRequestType.user,
            action: C_API.ApiRequestAction.error,
            id: data.id,
            payload: err,
          });
        });
      // delete user by user_id
      break;
    default:
      // error
      break;
  }
}
