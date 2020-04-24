"use strict";

const Catalog = require("../../../models/catalog");

describe("Catalog", function () {
  it("inherits from Array", function () {
    const catalog = new Catalog(this.fixtures.catalogOfCardNames);

    expect(catalog).to.be.an.instanceof(Array);
    expect(catalog).to.be.an.instanceof(Catalog);
  });

  it("its entries are defined by data properties", function () {
    const catalog = new Catalog(this.fixtures.catalogOfCardNames);

    expect(catalog[0]).to.be.a("string");
    expect(catalog[0]).to.equal(this.fixtures.catalogOfCardNames.data[0]);
    expect(catalog[1]).to.be.a("string");
    expect(catalog[1]).to.equal(this.fixtures.catalogOfCardNames.data[1]);
  });

  it("responds to Array methods", function () {
    const catalog = new Catalog(this.fixtures.catalogOfCardNames);

    expect(catalog.length).to.equal(20);

    catalog.push({ foo: "bar" });
    expect(catalog.length).to.equal(21);

    catalog.pop();
    expect(catalog.length).to.equal(20);

    const upperCaseNames = catalog.map((entry) => entry.toUpperCase());

    expect(upperCaseNames).to.be.an.instanceof(Array);
    expect(upperCaseNames).to.not.be.an.instanceof(Catalog);
    expect(upperCaseNames[0]).to.equal(
      this.fixtures.catalogOfCardNames.data[0].toUpperCase()
    );
    expect(upperCaseNames[1]).to.equal(
      this.fixtures.catalogOfCardNames.data[1].toUpperCase()
    );
  });

  it("applies properties to object", function () {
    const catalog = new Catalog(this.fixtures.catalogOfCardNames);

    expect(catalog.total_items).to.be.a("number");
    expect(catalog.total_items).to.equal(
      this.fixtures.catalogOfCardNames.total_items
    );
  });

  it("does not apply data property to object", function () {
    const catalog = new Catalog(this.fixtures.catalogOfCardNames);

    expect(catalog.data).to.equal(undefined);
  });
});
