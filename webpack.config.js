const path = require("path");

module.exports = {
  mode: "production",
  entry: "./docs/src/index.js",
  output: {
    filename: "script.js",
    path: path.resolve(__dirname, "docs"),
  },
};
