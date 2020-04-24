"use strict";

const browserify = require("browserify");
const path = require("path");
const fs = require("fs");
const mkdirp = require("mkdirp");
const checkES5 = require("check-ecmascript-version-compatibility");

describe("built file (be patient, this can take a while)", function () {
  let pathToBuild;

  beforeAll(function (done) {
    const distLocation = path.resolve(__dirname, "..", "..", "dist");

    mkdirp.sync(distLocation);

    const name = "scryfall-client";
    pathToBuild = path.resolve(distLocation, `${name}.js`);
    const bundleFs = fs.createWriteStream(pathToBuild);
    const b = browserify({ standalone: name });

    bundleFs.on("finish", done);

    b.add("./index.js");
    b.bundle().pipe(bundleFs);
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
