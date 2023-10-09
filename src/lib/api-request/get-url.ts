const SCRYFALL_API_ENDPOINT = "https://api.scryfall.com/";

function stringifyParams(params: Record<string, string>): string {
  return Object.keys(params).reduce((accum, param) => {
    if (accum) {
      accum += "&";
    }

    return (accum += `${param}=${params[param]}`);
  }, "");
}

function isFullScryfallUrl(url: string): boolean {
  return url.indexOf(SCRYFALL_API_ENDPOINT) === 0;
}

function endpointBeginsWithSlash(endpoint: string): boolean {
  return endpoint.indexOf("/") === 0;
}

function getBaseUrl(endpoint: string): string {
  if (isFullScryfallUrl(endpoint)) {
    return endpoint;
  }

  if (endpointBeginsWithSlash(endpoint)) {
    endpoint = endpoint.substring(1);
  }

  return SCRYFALL_API_ENDPOINT + endpoint;
}

export default function getUrl(
  endpoint: string,
  query?: Record<string, string>,
): string {
  let url = getBaseUrl(endpoint);

  if (query) {
    const queryParams = stringifyParams(query);

    if (url.indexOf("?") > -1) {
      url += "&";
    } else {
      url += "?";
    }

    url += queryParams;
  }

  return url;
}
