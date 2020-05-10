// https://scryfall.com/docs/api/rulings
type Source = "wotc" | "scryfall";

export default interface RawRulingResponse {
  object: "ruling";
  oracle_id: string; // the oracle id of the card that the ruling applies to
  source: Source; // A computer-readable string indicating which company produced this ruling, either wotc or scryfall.
  published_at: string; // The date when the ruling or note was published.
  comment: string; // The text of the ruling.
}
