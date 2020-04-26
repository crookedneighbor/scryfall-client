type ObjectKind =
  | "card"
  | "card_face"
  | "card_symbol"
  | "catlog"
  | "error"
  | "list"
  | "related_card"
  | "ruling"
  | "set";

export type ApiResponse = {
  object: ObjectKind;
  [property: string]: any;
};
