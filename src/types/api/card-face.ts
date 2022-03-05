import { Color, ImageUris } from "./constants";

export default interface CardFaceResponse {
  artist?: string; // The name of the illustrator of this card face. Newly spoiled cards may not have this field yet.
  color_indicator?: Color[]; // The colors in this face’s color indicator, if any.
  colors?: Color[]; // This face’s colors, if the game defines colors for the individual face of this card.
  flavor_text?: string; // The flavor text printed on this face, if any.
  flavor_name?: string; // The just-for-fun name printed on the card (such as for Godzilla series cards).
  illustration_id?: string; // A unique identifier for the card face artwork that remains consistent across reprints. Newly spoiled cards may not have this field yet.
  image_uris?: ImageUris; // An object providing URIs to imagery for this face, if this is a double-sided card. If this card is not double-sided, then the image_uris property will be part of the parent object instead.
  loyalty?: string; // This face’s loyalty, if any.
  mana_cost: string; // The mana cost for this face. This value will be any empty string "" if the cost is absent. Remember that per the game rules, a missing mana cost and a mana cost of {0} are different values.
  name: string; // The name of this particular face.
  object?: string; // A content type for this object, always card_face.
  oracle_text?: string; // The Oracle text for this face, if any.
  power?: string; // This face’s power, if any. Note that some cards have powers that are not numeric, such as *.
  printed_name?: string; // The localized name printed on this face, if any.
  printed_text?: string; // The localized text printed on this face, if any.
  printed_type_line?: string; // The localized type line printed on this face, if any.
  toughness?: string; // This face’s toughness, if any.
  type_line: string; // The type line of this particular face.
  watermark?: string; // The watermark on this particulary card face, if any.
}
