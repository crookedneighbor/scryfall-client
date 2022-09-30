const superagent = require("superagent");
const fs = require("fs");
const path = require("path");

console.log("Downloading latest symbol data from Scryfall...");

const pathToFixture = path.resolve(
  __dirname,
  "..",
  "src",
  "lib",
  "fixtures",
  "symbology.ts"
);

superagent
  .get("https://api.scryfall.com/symbology?pretty=true")
  .then((data) => {
    const symbols = data.body.data.reduce((accum, data) => {
      const char = data.symbol.replace(/[{}]/g, "");
      // the .com -> .io replacement is a temporary measure while we wait for
      // Scryfall to fix an error in their symbology endpoint that is displaying
      // the wrong domain for the svg_uri property
      accum[char] = data.svg_uri.replace("scryfall.com", "scryfall.io");
      return accum;
    }, {});
    const existingModule = fs.readFileSync(pathToFixture, "utf8");
    const module = `// auto-generated file, do not modify directly
// change /scripts/download-symbology-fixture.js if changes need to be made
export default ${JSON.stringify(symbols, null, 2)} as Record<string, string>`;

    if (existingModule !== module) {
      console.log("New symbolpogy data downloaded. Symbology fixture updated.");
      fs.writeFileSync(pathToFixture, module, "utf8");
    }
  });
