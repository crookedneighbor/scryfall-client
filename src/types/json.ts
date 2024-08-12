// from https://github.com/microsoft/TypeScript/issues/1897#issuecomment-338650717
export type AnyJson =
  | boolean
  | number
  | string
  | null
  | Array<AnyJson>
  | JsonMap;
export interface JsonMap {
  [key: string]: AnyJson;
}
