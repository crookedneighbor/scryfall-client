import type { ScryfallResponseObject } from "Types/api/response";
import type { ModelConfig } from "Types/model-config";

export default abstract class SingularEntity {
  _request: Function;

  constructor(scryfallObject: ScryfallResponseObject, config: ModelConfig) {
    this._request = config.requestMethod;
  }
}
