export type Color = "W" | "U" | "B" | "R" | "G";

export type ImageUris = {
  png: string;
  border_crop: string;
  art_crop: string;
  large: string;
  normal: string;
  small: string;
};

export type Prices = {
  usd: string;
  usd_foil: string;
  eur: string;
  tix: string;
};

export type Legality = "legal" | "not_legal" | "restricted" | "banned";
export type Legalities = {
  standard: Legality;
  future: Legality;
  historic: Legality;
  pioneer: Legality;
  modern: Legality;
  legacy: Legality;
  pauper: Legality;
  vintage: Legality;
  penny: Legality;
  commander: Legality;
  brawl: Legality;
  duel: Legality;
  oldschool: Legality;
};
