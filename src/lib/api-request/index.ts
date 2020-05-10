import sendApiRequest from "Lib/api-request/send-request-to-api";
import type { AnyJson } from "Types/json";

export function get<T>(
  url: string,
  query?: Record<string, string>
): Promise<T> {
  return sendApiRequest({
    endpoint: url,
    method: "get",
    query,
  });
}

export function post<T>(
  url: string,
  body?: Record<string, AnyJson>
): Promise<T> {
  return sendApiRequest({
    endpoint: url,
    method: "post",
    body,
  });
}
