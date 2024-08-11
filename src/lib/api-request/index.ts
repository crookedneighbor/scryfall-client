import sendApiRequest from "../../lib/api-request/send-request-to-api";
import type { AnyJson } from "../../types/json";

export { setUserAgent } from "./user-agent";

export function get<T>(
  url: string,
  query?: Record<string, string>,
): Promise<T> {
  return sendApiRequest({
    endpoint: url,
    method: "get",
    query,
  });
}

export function post<T>(
  url: string,
  body?: Record<string, AnyJson>,
): Promise<T> {
  return sendApiRequest({
    endpoint: url,
    method: "post",
    body,
  });
}
