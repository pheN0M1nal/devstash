/**
 * A single item type present inside a collection, with how many items use it.
 */
export interface CollectionTypeBreakdown {
  id: string;
  name: string;
  icon: string;
  color: string;
  count: number;
}

/**
 * A collection enriched with the stats the dashboard cards render.
 */
export interface CollectionWithStats {
  id: string;
  name: string;
  description: string | null;
  isFavorite: boolean;
  itemCount: number;
  /** Item types in the collection, most-used first. */
  types: CollectionTypeBreakdown[];
  /** Color of the most-used type, used for the card accent border. */
  accentColor: string;
  createdAt: Date;
  updatedAt: Date;
}
