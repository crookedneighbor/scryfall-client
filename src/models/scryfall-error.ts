"use strict";
import { ScryfallError as ScryfallAPIError } from "Types/api/error";

class ExtendableError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);

    this.name = this.constructor.name;

    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error(message).stack;
    }
  }
}

class ScryfallError extends ExtendableError {
  thrownError?: Error;
  status?: number;
  code?: string;
  details?: string;
  type?: string;
  warnings?: string[];

  constructor(scryfallResponse: ScryfallAPIError | Record<string, any>) {
    const message = scryfallResponse.message || scryfallResponse.details;

    super(message);

    Object.assign(this, scryfallResponse);
  }
}

export default ScryfallError;
