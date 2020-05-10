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
  // TODO can we get away with unknown here?
  // or not having it at all?
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [property: string]: any;
};

export interface ListApiResponse extends ApiResponse {
  object: "list";
  data: ApiResponse[];
}
export interface CatalogApiResponse extends ApiResponse {
  object: "catalog";
  data: string[];
}
