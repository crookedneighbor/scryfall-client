export interface ModelConfig {
  textTransformer?: (str: string) => string;
  // TODO use more specific signature
  requestMethod: Function;
}
