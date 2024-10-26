import ScryfallError from "../../models/scryfall-error";

import type { ApiResponse } from "../../types/api-response";
import type { AnyJson } from "../../types/json";
import { getUserAgent } from "./user-agent";

type PostBody = Record<string, AnyJson>;

interface RequestOptions {
  url: string;
  method?: "post" | "get";
  body?: PostBody;
}

function makeRequest({ url, method, body }: RequestOptions) {
  return fetch(url, {
    method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "User-Agent": getUserAgent(),
    },
    body: body ? JSON.stringify(body) : undefined,
  }).then((res) => res.json());
}

export default async function sendRequest(
  options: RequestOptions,
): Promise<ApiResponse> {
  const response = await makeRequest(options);

  if (response.object === "error") {
    return Promise.reject(new ScryfallError(response));
  }

  return response;
}
