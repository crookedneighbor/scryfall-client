/* eslint-disable no-undef */
import superagent from "superagent";
import fs from "fs";
import path from "path";

console.log("Downloading latest symbol data from Scryfall...");

const pathToFixture = path.resolve(
  __dirname,
  "..",
  "src",
  "lib",
  "fixtures",
  "symbology.ts",
);

superagent.get("https://api.scryfall.com/symbology").then((data) => {
  const symbols = data.body.data.reduce((accum, data) => {
    const char = data.symbol.replace(/[{}/]/g, "");

    if (char in accum) {
      throw new Error(`Unexpected duplicate symbol ${char}`);
    }
    const uri = data.svg_uri;
    accum[char] = uri;

    // if character is one of the Hybrid WUBRG Symbol
    // or 2 Mana + WUBRG
    // or WUBRG + Phyrexian
    // or WUBRG + WUBRG + Phyrexian
    // then reverse the first two symbols in the key
    // and then add the reversed option as well
    // so that people don't have to remember the exact
    // order that the symbols go in to use them
    if (/^[WUBRG2][WUBRGP](P)?$/.test(char)) {
      const firstTwoCharactersInKeyReversed = char
        .substring(0, 2)
        .split("")
        .reverse()
        .join("");
      const restOfKey = char.substring(2);
      const commonMisspellingOfKey =
        firstTwoCharactersInKeyReversed + restOfKey;

      accum[commonMisspellingOfKey] = uri;
    }

    return accum;
  }, {});
  const existingModule = fs.readFileSync(pathToFixture, "utf8");
  const module = `// auto-generated file, do not modify directly
// change /scripts/download-symbology-fixture.js if changes need to be made
export default ${JSON.stringify(symbols, null, 2)} as Record<string, string>`;

  if (existingModule !== module) {
    fs.writeFileSync(pathToFixture, module, "utf8");
    console.error(
      "New symbology data downloaded. Symbology fixture updated. Aborting pre-publish task so the new file can be committed.",
    );
    process.exit(1);
  } else {
    console.log("No changes to symbology data detected. Continuing.");
  }
});
