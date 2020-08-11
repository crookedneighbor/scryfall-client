import type List from "../models/list";
import type Card from "../models/card";
import type MagicSet from "../models/magic-set";
import type Catalog from "../models/catalog";
import type GenericScryfallResponse from "../models/generic-scryfall-response";
import type SingularEntity from "../models/singular-entity";

export type Model =
  | Card
  | Catalog
  | GenericScryfallResponse
  | List<SingularEntity>
  | MagicSet;

export type {
  List,
  Card,
  MagicSet,
  Catalog,
  GenericScryfallResponse,
  SingularEntity,
};
