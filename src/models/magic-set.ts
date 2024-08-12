import SingularEntity from "./singular-entity";
import type Card from "./card";
import type List from "./list";
import { get } from "../lib/api-request";

import type SetApiResponse from "../types/api/set";

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging, @typescript-eslint/no-empty-object-type
interface MagicSet extends SetApiResponse {}
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
class MagicSet extends SingularEntity {
  constructor(scryfallObject: SetApiResponse) {
    super(scryfallObject);
  }

  getCards(): Promise<List<Card>> {
    return get(this.search_uri);
  }
}

export default MagicSet;
