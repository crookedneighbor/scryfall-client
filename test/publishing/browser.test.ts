"use strict";

const webpack = require("webpack");
const path = require("path");
const fs = require("fs");
const mkdirp = require("mkdirp");
const checkES5 = require("check-ecmascript-version-compatibility");

describe("built file (be patient, this can take a while)", function () {
  let pathToBuild;

  beforeAll(function (done) {
    const entry = path.resolve(__dirname, "..", "..", "index.js");
    const dist = path.resolve(__dirname, "..", "..", "publishing-test-dist");
    const filename = "browser.js";

    pathToBuild = path.resolve(dist, filename);
    mkdirp.sync(dist);

    webpack(
      {
        mode: "production",
        entry,
        output: {
          filename,
          path: dist,
        },
      },
      (err, stats) => {
        if (err || stats.hasErrors()) {
          done(new Error("something went wrong"));

          return;
        }

        done();
      }
    );
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
