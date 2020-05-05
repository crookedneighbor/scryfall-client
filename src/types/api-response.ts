export type ObjectKind =
  | "card"
  | "card_face"
  | "card_symbol"
  | "catalog"
  | "error"
  | "list"
  | "related_card"
  | "ruling"
  | "set";

export type ApiResponse = {
  object: ObjectKind;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [property: string]: any;
};
