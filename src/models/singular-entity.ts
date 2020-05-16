import type { ApiResponse } from "../types/api-response";

export default abstract class SingularEntity {
  constructor(scryfallObject: ApiResponse) {
    Object.assign(this, scryfallObject);
  }
}
