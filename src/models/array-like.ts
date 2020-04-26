import { ScryfallList } from "Types/api/response";
import { ScryfallCatalog } from "Types/api/catalog";

// based on https://javascript.info/extend-natives
export default abstract class ArrayLike extends Array {
  constructor(scryfallObject: ScryfallList | ScryfallCatalog) {
    super();

    Object.setPrototypeOf(this, new.target.prototype);

    this.push(...scryfallObject.data);
  }

  // built-in methods will use this as the constructor
  static get [Symbol.species]() {
    return Array;
  }
}
