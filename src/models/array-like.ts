import { ApiResponse } from "../types/api-response";

interface ArrayLikeResponse extends ApiResponse {
  object: "list" | "catalog";
}

// based on https://javascript.info/extend-natives
export default abstract class ArrayLike<T> extends Array {
  constructor(scryfallObject: ArrayLikeResponse) {
    super();

    Object.setPrototypeOf(this, new.target.prototype);

    const data = scryfallObject.data as T[];
    this.push(...data);
  }

  // built-in methods will use this as the constructor

  static get [Symbol.species]() {
    return Array;
  }
}
