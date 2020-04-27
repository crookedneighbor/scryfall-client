import superagent = require("superagent");
import ScryfallError from "Models/scryfall-error";

import type { ApiResponse } from "Types/api-response";

type PostBody = Record<string, any>;

interface RequestOptions {
  url: string;
  method: "post" | "get";
  body?: PostBody;
}

function get(url: string) {
  return superagent.get(url);
}

function post(url: string, body: PostBody) {
  return superagent.post(url).send(body);
}

export default function sendRequest(
  options: RequestOptions
): Promise<ApiResponse> {
  let requestPromise;

  if (options.method === "post" && options.body) {
    requestPromise = post(options.url, options.body);
  } else {
    requestPromise = get(options.url);
  }

  return requestPromise.set("Accept", "application/json").then((response) => {
    let responseBody;

    try {
      responseBody = JSON.parse(response.text);
    } catch (parsingError) {
      return Promise.reject(
        new ScryfallError({
          message: "Could not parse response from Scryfall.",
          thrownError: parsingError,
        })
      );
    }

    if (responseBody.object === "error") {
      return Promise.reject(new ScryfallError(responseBody));
    }

    return responseBody;
  });
}
