type RelatedCardComponent =
  | "token"
  | "meld_part"
  | "meld_result"
  | "combo_piece";

export default interface RelatedComponentResponse {
  object: "related_card";
  id: string; // An unique ID for this card in Scryfall’s database.
  component: RelatedCardComponent; // A field explaining what role this card plays in this relationship, one of token, meld_part, meld_result, or combo_piece.
  name: string; // The name of this particular related card.
  type_line: string; // The type line of this card.
  uri: string; // A URI where you can retrieve a full object describing this card on Scryfall’s API.
}
