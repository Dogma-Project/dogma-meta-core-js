import { Types } from "../../types";

export default function response(
  id: number | string,
  code: number,
  message?: string
) {
  const res: Types.Response.Main = { id, code };
  if (message) res.message = message;
  return res;
}
