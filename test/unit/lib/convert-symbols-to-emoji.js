"use strict";

const convertSymbolsToEmoji = require("../../../lib/convert-symbols-to-emoji");

describe("convertSymbolsToEmoji", function () {
  describe("slack", function () {
    it("replaces symbols with mana named emojis", function () {
      expect(convertSymbolsToEmoji.slack("Foo {t} Bar")).to.equal(
        "Foo :mana-t: Bar"
      );
    });

    it("replaces hybrid mana symbols with mana named emojis", function () {
      expect(convertSymbolsToEmoji.slack("Foo {u/b} Bar")).to.equal(
        "Foo :mana-ub: Bar"
      );
    });

    it("leaves text without symbols unchanged", function () {
      expect(convertSymbolsToEmoji.slack("Foo Bar")).to.equal("Foo Bar");
    });
  });

  describe("discord", function () {
    it("replaces symbols with mana named emojis", function () {
      expect(convertSymbolsToEmoji.discord("Foo {t} Bar")).to.equal(
        "Foo :manat: Bar"
      );
    });

    it("replaces hybrid mana symbols with mana named emojis", function () {
      expect(convertSymbolsToEmoji.discord("Foo {u/b} Bar")).to.equal(
        "Foo :manaub: Bar"
      );
    });

    it("leaves text without symbols unchanged", function () {
      expect(convertSymbolsToEmoji.discord("Foo Bar")).to.equal("Foo Bar");
    });
  });
});
