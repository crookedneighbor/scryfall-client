import type { ApiResponse, ObjectKind } from "Types/api-response";

export default abstract class SingularEntity {
  object: ObjectKind;
  // allow other arbitrary data from Scryfall API Objects
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [property: string]: any;

  constructor(scryfallObject: ApiResponse) {
    this.object = scryfallObject.object;

    Object.assign(this, scryfallObject);
  }
}
