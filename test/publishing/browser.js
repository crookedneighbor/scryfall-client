"use strict";

const expect = require("chai").expect;
const browserify = require("browserify");
const path = require("path");
const fs = require("fs");
const mkdirp = require("mkdirp");
const checkES5 = require("check-ecmascript-version-compatibility");

describe("built file (be patient, this can take a while)", function () {
  before(function (done) {
    const distLocation = path.resolve(__dirname, "..", "..", "dist");

    mkdirp.sync(distLocation);

    const name = "scryfall-client";
    this.path = path.resolve(distLocation, `${name}.js`);
    const bundleFs = fs.createWriteStream(this.path);
    const b = browserify({ standalone: name });

    bundleFs.on("finish", done);

    b.add("./index.js");
    b.bundle().pipe(bundleFs);
  });

  it("is es5 compliant", function (done) {
    this.slow(40000);
    this.timeout(45000);

    checkES5(this.path, done);
  });

  it("is less then 90 KiB unminified", function (done) {
    fs.stat(this.path, function (err, stats) {
      if (err) {
        done(err);

        return;
      }

      expect(stats.size).to.be.lessThan(90000);

      done();
    });
  });
});
