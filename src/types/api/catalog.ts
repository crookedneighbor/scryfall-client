export type ScryfallCatalog = {
  object: "catalog";
  uri: URL; // A link to the current catalog on Scryfall’s API.
  total_values: number; // The number of items in the data array.
  data: string[]; // An array of datapoints, as strings.
};
