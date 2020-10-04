"use strict";

import SingularEntity from "./singular-entity";

import type CardSymbolApiResponse from "../types/api/card-symbol";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface CardSymbol extends CardSymbolApiResponse {}
class CardSymbol extends SingularEntity {
  constructor(scryfallObject: CardSymbolApiResponse) {
    super(scryfallObject);
  }
}

export default CardSymbol;
