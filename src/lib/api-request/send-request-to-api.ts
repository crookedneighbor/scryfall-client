import wrapScryfallResponse from "../../lib/wrap-scryfall-response";
import getUrl from "./get-url";
import enqueTask from "./enque-task";
import sendRequest from "./send-request";
import ScryfallError from "../../models/scryfall-error";
import type { ApiResponse } from "../../types/api-response";
import type { AnyJson } from "../../types/json";

type RequestOptions = {
  endpoint: string;
  method?: "get" | "post";
  body?: Record<string, AnyJson>;
  query?: Record<string, string>;
};

export default function sendRequestToApi(
  options: RequestOptions,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
  const url = getUrl(options.endpoint, options.query);

  return enqueTask<ApiResponse>(() => {
    return sendRequest({
      url,
      method: options.method,
      body: options.body,
    });
  })
    .then((response) => {
      try {
        return wrapScryfallResponse(response);
      } catch (err) {
        return Promise.reject(
          new ScryfallError({
            message:
              "Something went wrong when wrapping the response from Scryfall",
            thrownError: err,
          }),
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
