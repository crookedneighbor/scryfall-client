let userAgent = "";

export function getUserAgent() {
  return userAgent;
}

export function setUserAgent(agent: string) {
  userAgent = agent;
}

export function resetUserAgent() {
  setUserAgent("");
}
