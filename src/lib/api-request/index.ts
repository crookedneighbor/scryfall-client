import wrapScryfallResponse from "Lib/wrap-scryfall-response";
import getUrl from "./get-url";
import enqueTask from "./enque-task";
import sendRequest from "./send-request";
import ScryfallError from "Models/scryfall-error";
import type { ApiResponse } from "Types/api-response";

type RequestOptions = {
  endpoint: string;
  method?: "get" | "post";
  body?: Record<string, any>;
  query?: Record<string, string>;
};

// TODO no any
function wrapFunction(body: ApiResponse): any {
  // TODO
  // const wrapOptions = {
  //   requestMethod: requestFunction,
  // } as ModelConfig;
  //
  // if (options.textTransformer) {
  //   wrapOptions.textTransformer = options.textTransformer;
  // } else if (options.convertSymbolsToSlackEmoji) {
  //   wrapOptions.textTransformer = convertSymbolsToEmoji.slack;
  // } else if (options.convertSymbolsToDiscordEmoji) {
  //   wrapOptions.textTransformer = convertSymbolsToEmoji.discord;
  // }
  // return wrapScryfallResponse(body, wrapOptions);
  return wrapScryfallResponse(body);
}

export default function sendRequestToApi(
  options: RequestOptions
  // TODO no any
): Promise<any> {
  const url = getUrl(options.endpoint, options.query);

  return enqueTask(() => {
    return sendRequest({
      url,
      method: options.method,
      body: options.body,
    });
  })
    .then((response) => {
      try {
        return wrapFunction(response as ApiResponse);
      } catch (err) {
        return Promise.reject(
          new ScryfallError({
            message:
              "Something went wrong when wrapping the response from Scryfall",
            thrownError: err,
          })
        );
      }
    })
    .catch((err) => {
      if (!(err instanceof ScryfallError)) {
        err = new ScryfallError({
          message:
            "An unexpected error occurred when requesting resources from Scryfall.",
          status: err.status,
          originalError: err,
        });
      }

      return Promise.reject(err);
    });
}
