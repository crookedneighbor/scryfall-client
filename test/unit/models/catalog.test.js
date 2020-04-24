"use strict";

const Catalog = require("../../../models/catalog");
const fixtures = require("../../fixtures");

describe("Catalog", function () {
  it("inherits from Array", function () {
    const catalog = new Catalog(fixtures.catalogOfCardNames);

    expect(catalog).toBeInstanceOf(Array);
    expect(catalog).toBeInstanceOf(Catalog);
  });

  it("its entries are defined by data properties", function () {
    const catalog = new Catalog(fixtures.catalogOfCardNames);

    expect(typeof catalog[0]).toBe("string");
    expect(catalog[0]).toBe(fixtures.catalogOfCardNames.data[0]);
    expect(typeof catalog[1]).toBe("string");
    expect(catalog[1]).toBe(fixtures.catalogOfCardNames.data[1]);
  });

  it("responds to Array methods", function () {
    const catalog = new Catalog(fixtures.catalogOfCardNames);

    expect(catalog.length).toBe(20);

    catalog.push({ foo: "bar" });
    expect(catalog.length).toBe(21);

    catalog.pop();
    expect(catalog.length).toBe(20);

    const upperCaseNames = catalog.map((entry) => entry.toUpperCase());

    expect(upperCaseNames).toBeInstanceOf(Array);
    expect(upperCaseNames).not.toBeInstanceOf(Catalog);
    expect(upperCaseNames[0]).toBe(
      fixtures.catalogOfCardNames.data[0].toUpperCase()
    );
    expect(upperCaseNames[1]).toBe(
      fixtures.catalogOfCardNames.data[1].toUpperCase()
    );
  });

  it("applies properties to object", function () {
    const catalog = new Catalog(fixtures.catalogOfCardNames);

    expect(catalog.total_items).toBeGreaterThan(0);
    expect(catalog.total_items).toBe(fixtures.catalogOfCardNames.total_items);
  });

  it("does not apply data property to object", function () {
    const catalog = new Catalog(fixtures.catalogOfCardNames);

    expect(catalog.data).toBeUndefined();
  });
});
