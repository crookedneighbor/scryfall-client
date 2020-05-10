import type { ApiResponse } from "Types/api-response";

export default abstract class SingularEntity {
  constructor(scryfallObject: ApiResponse) {
    Object.assign(this, scryfallObject);
  }
}
