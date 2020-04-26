import { ApiResponse, ObjectKind } from "Types/api-response";
import type { ModelConfig } from "Types/model-config";

export default abstract class SingularEntity {
  _request: Function;
  object: ObjectKind;
  // allow other arbitrary data from Scryfall API Objects
  [property: string]: any;

  constructor(scryfallObject: ApiResponse, config: ModelConfig) {
    this._request = config.requestMethod;
    this.object = scryfallObject.object;

    Object.assign(this, scryfallObject);
  }
}
