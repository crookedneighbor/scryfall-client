export type CardCollectionIdentifier =
  | {
      id: string;
    }
  | {
      mtgo_id: number;
    }
  | {
      multiverse_id: number;
    }
  | {
      oracle_id: string;
    }
  | {
      illustration_id: string;
    }
  | {
      name: string;
    }
  | {
      name: string;
      set: string;
    }
  | {
      collector_number: string;
      set: string;
    };
