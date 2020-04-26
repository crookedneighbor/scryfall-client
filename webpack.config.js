const path = require("path");

module.exports = {
  mode: "production",
  entry: "./docs/src/index.ts",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
    alias: {
      Lib: path.resolve(__dirname, "src/lib/"),
      Types: path.resolve(__dirname, "src/types/"),
      Models: path.resolve(__dirname, "src/models/"),
    },
  },
  output: {
    filename: "script.js",
    path: path.resolve(__dirname, "docs"),
  },
};
