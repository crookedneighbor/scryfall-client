"use strict";

import SingularEntity from "./singular-entity";

import type CardSymbolApiResponse from "../types/api/card-symbol";

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
interface CardSymbol extends CardSymbolApiResponse {}
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
class CardSymbol extends SingularEntity {
  constructor(scryfallObject: CardSymbolApiResponse) {
    super(scryfallObject);
  }
}

export default CardSymbol;
