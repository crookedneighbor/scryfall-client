"use strict";
import { ApiError } from "../types/api-error";

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

  constructor(scryfallResponse: ApiError | Error | Record<string, unknown>) {
    const message = (scryfallResponse.message ||
      (scryfallResponse as ApiError).details) as string;

    super(message);

    Object.assign(this, scryfallResponse);
  }
}

export default ScryfallError;
