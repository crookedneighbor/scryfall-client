"use strict";

/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require("webpack");
const checkES5 = require("check-ecmascript-version-compatibility");
const config = require("../../webpack.config");
/* eslint-enable @typescript-eslint/no-var-requires */

import path = require("path");
import fs = require("fs");

describe("built file (be patient, this can take a while)", function () {
  let pathToBuild: string;

  beforeAll(function (done) {
    config.entry = path.resolve(__dirname, "..", "..", "src", "index.ts");
    config.output.path = path.resolve(
      __dirname,
      "..",
      "..",
      "publishing-test-dist"
    );
    config.output.filename = "browser.js";

    pathToBuild = path.resolve(config.output.path, config.output.filename);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    webpack(config, (err: Error, stats: any) => {
      if (err || stats.hasErrors()) {
        console.log(err);
        console.log(stats && stats.toJson("minimal"));
        done(new Error("something went wrong"));

        return;
      }

      done();
    });
  });

  it("is es5 compliant", function (done) {
    checkES5(pathToBuild, done);
  });

  it("is less then 90 KiB unminified", function (done) {
    fs.stat(pathToBuild, function (err, stats) {
      if (err) {
        done(err);

        return;
      }

      expect(stats.size).toBeLessThan(90000);

      done();
    });
  });
});
