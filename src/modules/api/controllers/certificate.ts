import { C_API } from "@dogma-project/constants-meta";
import { API } from "../../../types";
import WorkerApi from "../index";
import logger from "../../logger";
import getCertificate from "./certificate/get";
import pushCertificate from "./certificate/push";

export default function CertificateController(
  this: WorkerApi,
  data: API.Request
) {
  switch (data.action) {
    case C_API.ApiRequestAction.get:
      // export own cert
      getCertificate()
        .then((res) => {
          this.response({
            type: C_API.ApiRequestType.certificate,
            action: C_API.ApiRequestAction.result,
            id: data.id,
            payload: res,
          });
        })
        .catch((err) => {
          logger.error("API CERTIFICATE", err);
          this.error({
            type: C_API.ApiRequestType.certificate,
            action: C_API.ApiRequestAction.error,
            id: data.id,
            payload: err,
          });
        });
      break;
    case C_API.ApiRequestAction.push:
      // import friend's cert
      pushCertificate(data.payload)
        .then((res) => {
          this.response({
            type: C_API.ApiRequestType.certificate,
            action: C_API.ApiRequestAction.result,
            id: data.id,
            payload: res,
          });
        })
        .catch((err) => {
          logger.error("API CERTIFICATE", err);
          this.error({
            type: C_API.ApiRequestType.certificate,
            action: C_API.ApiRequestAction.error,
            id: data.id,
            payload: err,
          });
        });
      break;
    default:
      // error
      break;
  }
}
