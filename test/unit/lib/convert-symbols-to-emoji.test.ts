import { slack, discord } from "../../../src/lib/convert-symbols-to-emoji";

describe("convertSymbolsToEmoji", function () {
  describe("slack", function () {
    it("replaces symbols with mana named emojis", function () {
      expect(slack("Foo {t} Bar")).toBe("Foo :mana-t: Bar");
    });

    it("replaces hybrid mana symbols with mana named emojis", function () {
      expect(slack("Foo {u/b} Bar")).toBe("Foo :mana-ub: Bar");
    });

    it("leaves text without symbols unchanged", function () {
      expect(slack("Foo Bar")).toBe("Foo Bar");
    });
  });

  describe("discord", function () {
    it("replaces symbols with mana named emojis", function () {
      expect(discord("Foo {t} Bar")).toBe("Foo :manat: Bar");
    });

    it("replaces hybrid mana symbols with mana named emojis", function () {
      expect(discord("Foo {u/b} Bar")).toBe("Foo :manaub: Bar");
    });

    it("leaves text without symbols unchanged", function () {
      expect(discord("Foo Bar")).toBe("Foo Bar");
    });
  });
});
