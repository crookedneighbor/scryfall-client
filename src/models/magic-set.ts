"use strict";

import SingularEntity from "Models/singular-entity";
import type Card from "Models/card";
import type List from "Models/list";
import { get } from "Lib/api-request";

import type SetApiResponse from "Types/api/set";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface MagicSet extends SetApiResponse {}
class MagicSet extends SingularEntity {
  constructor(scryfallObject: SetApiResponse) {
    super(scryfallObject);
  }

  getCards(): Promise<List<Card>> {
    return get(this.search_uri);
  }
}

export default MagicSet;
