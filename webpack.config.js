import path from "path";

export default {
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
      Api: path.resolve("src/api-routes/"),
      Lib: path.resolve("src/lib/"),
      Types: path.resolve("src/types/"),
      Models: path.resolve("src/models/"),
    },
  },
  output: {
    filename: "script.js",
    path: path.resolve("docs"),
  },
};
