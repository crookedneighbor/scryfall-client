import superagent, { type SuperAgentRequest } from "superagent";
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

function get(url: string): SuperAgentRequest {
  return superagent.get(url);
}

function post(url: string, body: PostBody): SuperAgentRequest {
  return superagent.post(url).send(body);
}

export default function sendRequest(
  options: RequestOptions,
): Promise<ApiResponse> {
  let requestPromise;

  if (options.method === "post" && options.body) {
    requestPromise = post(options.url, options.body);
  } else {
    requestPromise = get(options.url);
  }

  return requestPromise
    .set("Accept", "application/json")
    .set("User-Agent", getUserAgent())
    .then((response) => {
      let responseBody;

      try {
        responseBody = JSON.parse(response.text);
      } catch (parsingError) {
        return Promise.reject(
          new ScryfallError({
            message: "Could not parse response from Scryfall.",
            thrownError: parsingError,
          }),
        );
      }

      if (responseBody.object === "error") {
        return Promise.reject(new ScryfallError(responseBody));
      }

      return responseBody;
    });
}
