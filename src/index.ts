"use strict";

var makeRequestFunction = require("./lib/request");

function ScryfallClient(options) {
  this._request = makeRequestFunction(options);
}

ScryfallClient.prototype.get = function (url, query) {
  return this._request(url, {
    method: "get",
    query: query,
  });
};

ScryfallClient.prototype.post = function (url, body) {
  return this._request(url, {
    body: body,
    method: "post",
  });
};

ScryfallClient.prototype.getSymbolUrl = function (symbol) {
  var character = symbol.match(/{?(.)}?/)[1];

  return "https://img.scryfall.com/symbology/" + character + ".svg";
};

ScryfallClient.prototype.wrap = function (body) {
  return this._request.wrapFunction(body);
};

module.exports = ScryfallClient;
