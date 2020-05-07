import { ApiResponse } from "Types/api-response";

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
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  static get [Symbol.species]() {
    return Array;
  }
}
