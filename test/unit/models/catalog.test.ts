"use strict";

import Catalog from "Models/catalog";
import fixtures from "Fixtures";

describe("Catalog", function () {
  it("inherits from Array", function () {
    const catalog = new Catalog(fixtures.catalogOfCardNames);

    expect(catalog).toBeInstanceOf(Array);
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
      fixtures.catalogOfCardNames.data[0].toUpperCase(),
    );
    expect(upperCaseNames[1]).toBe(
      fixtures.catalogOfCardNames.data[1].toUpperCase(),
    );
  });

  it("applies properties to object", function () {
    const catalog = new Catalog(fixtures.catalogOfCardNames);

    expect(catalog.total_values).toBeGreaterThan(0);
    expect(catalog.total_values).toBe(fixtures.catalogOfCardNames.total_values);
  });
});
