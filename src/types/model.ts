import type List from "Models/list";
import type Card from "Models/card";
import type MagicSet from "Models/magic-set";
import type Catalog from "Models/catalog";
import type GenericScryfallResponse from "Models/generic-scryfall-response";
import type SingularEntity from "Models/singular-entity";

export type Model =
  | Card
  | Catalog
  | GenericScryfallResponse
  | List<SingularEntity>
  | MagicSet;
