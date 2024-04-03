import crypto, { PrivateKeyInput } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

import { C_Event, C_Keys, C_System } from "../../../../constants";
import stateManager from "../../../../components/state";
import { Keys } from "../../../../types";
import logger from "../../../logger";
import { getDatadir } from "../../../datadir";

export default function importUserKey(cert: Keys.Import) {
  try {
    let str: string;
    if ("path" in cert) {
      str = fs.readFileSync(cert.path).toString();
    } else {
      str = cert.b64;
    }
    const parsed = JSON.parse(
      Buffer.from(str, "base64").toString()
    ) as Keys.ExportFormat;
    // logger.info("import", parsed);
    const privateKeyBuffer = Buffer.from(parsed.key, "hex");
    const input: PrivateKeyInput = {
      key: privateKeyBuffer,
      type: C_Keys.FORMATS.TYPE,
      format: C_Keys.FORMATS.FORMAT,
    };
    const privateUserKey = crypto.createPrivateKey(input);
    const pubKeyObject = crypto.createPublicKey(privateUserKey);
    const publicKeyExport = pubKeyObject.export({
      type: C_Keys.FORMATS.TYPE,
      format: C_Keys.FORMATS.FORMAT,
    });
    const publicKeyBuffer =
      typeof publicKeyExport === "string"
        ? Buffer.from(publicKeyExport)
        : publicKeyExport;
    if (privateKeyBuffer && publicKeyBuffer) {
      const dir = getDatadir();
      fs.writeFileSync(
        path.join(dir.keys, "/master-public.pem"),
        publicKeyBuffer
      );
      fs.writeFileSync(
        path.join(dir.keys, "/master-private.pem"),
        privateKeyBuffer
      );
      stateManager.emit(C_Event.Type.userKey, C_System.States.ready);
      return true;
    }
  } catch (err) {
    logger.error("import key", err);
    return null;
  }
  return null;
}
