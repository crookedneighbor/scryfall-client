export type ApiError = {
  // Not part of the documented api
  message?: string;

  // From https://scryfall.com/docs/api/errors
  status: number; // An integer HTTP status code for this error.
  code: string; // A computer-friendly string representing the appropriate HTTP status code.
  details: string; // A human-readable string explaining the error.
  type?: string; // A computer-friendly string that provides additional context for the main error. For example, an endpoint many generate HTTP 404 errors for different kinds of input. This field will provide a label for the specific kind of 404 failure, such as ambiguous.
  warnings?: string[]; // If your input also generated non-failure warnings, they will be provided as human-readable strings in this array.
};
