"use strict";

const SingularEntity = require("../../../models/singular-entity");
const fixtures = require("../../fixtures");

describe("SingularEntity", function () {
  let fakeRequestMethod, fakeScryfallObject, ChildModel;

  beforeEach(function () {
    fakeRequestMethod = jest.fn();
    fakeScryfallObject = {
      object: "foo",
    };

    function ChildModelClass(scryfallObject, requestMethod) {
      SingularEntity.call(this, scryfallObject, requestMethod);
    }
    ChildModel = ChildModelClass;
    ChildModel.SCRYFALL_MODEL_NAME = "foo";
    ChildModel.prototype = Object.create(SingularEntity.prototype);
    ChildModel.prototype.constructor = ChildModel;
  });

  it("does not throw if object type matches child class's type", function () {
    expect(() => {
      new ChildModel(fakeScryfallObject, fakeRequestMethod); // eslint-disable-line no-new
    }).not.toThrow();
  });

  it("throws if object type does not match child class's type", function () {
    expect(() => {
      new ChildModel(fixtures.listOfRulings, fakeRequestMethod); // eslint-disable-line no-new
    }).toThrow('Object type must be "foo"');
  });
});
