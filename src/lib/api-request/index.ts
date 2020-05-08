import sendApiRequest from "Lib/api-request/send-request-to-api";

// TODO no any
export function get<T>(url: string, query?: Record<string, any>): Promise<T> {
  return sendApiRequest({
    endpoint: url,
    method: "get",
    query,
  });
}

// TODO no any
export function post<T>(url: string, body?: Record<string, any>): Promise<T> {
  return sendApiRequest({
    endpoint: url,
    method: "post",
    body,
  });
}
