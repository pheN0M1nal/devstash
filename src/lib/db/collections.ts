import { prisma } from "@/lib/prisma";
import { FALLBACK_TYPE_COLOR } from "@/lib/constants/item-types";
import type {
  CollectionTypeBreakdown,
  CollectionWithStats,
} from "@/types/collection";

/**
 * Shape returned by the Prisma query below. Kept local so the mapper stays typed
 * without leaking Prisma types into the UI layer.
 */
interface CollectionRow {
  id: string;
  name: string;
  description: string | null;
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
  items: {
    item: {
      itemType: {
        id: string;
        name: string;
        icon: string;
        color: string;
      };
    };
  }[];
}

const collectionSelect = {
  id: true,
  name: true,
  description: true,
  isFavorite: true,
  createdAt: true,
  updatedAt: true,
  items: {
    select: {
      item: {
        select: {
          itemType: {
            select: { id: true, name: true, icon: true, color: true },
          },
        },
      },
    },
  },
} as const;

/**
 * Collapses a collection's items into per-type counts, ordered most-used first.
 */
function buildTypeBreakdown(row: CollectionRow): CollectionTypeBreakdown[] {
  const counts = new Map<string, CollectionTypeBreakdown>();

  for (const { item } of row.items) {
    const type = item.itemType;
    const existing = counts.get(type.id);

    if (existing) {
      existing.count += 1;
    } else {
      counts.set(type.id, { ...type, count: 1 });
    }
  }

  return [...counts.values()].sort(
    (a, b) => b.count - a.count || a.name.localeCompare(b.name)
  );
}

function toCollectionWithStats(row: CollectionRow): CollectionWithStats {
  const types = buildTypeBreakdown(row);

  return {
    id: row.id,
    name: row.name,
    description: row.description,
    isFavorite: row.isFavorite,
    itemCount: row.items.length,
    types,
    accentColor: types[0]?.color ?? FALLBACK_TYPE_COLOR,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

/**
 * Most recently updated collections for a user, with item counts and the
 * per-type breakdown used for the card accent color and type icons.
 */
export async function getRecentCollections(
  userId: string,
  limit = 6
): Promise<CollectionWithStats[]> {
  const collections = await prisma.collection.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    take: limit,
    select: collectionSelect,
  });

  return collections.map(toCollectionWithStats);
}

/**
 * All collections for a user, most recently updated first.
 */
export async function getCollections(
  userId: string
): Promise<CollectionWithStats[]> {
  const collections = await prisma.collection.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    select: collectionSelect,
  });

  return collections.map(toCollectionWithStats);
}

/**
 * A single collection with stats, scoped to the owning user.
 */
export async function getCollectionById(
  userId: string,
  collectionId: string
): Promise<CollectionWithStats | null> {
  const collection = await prisma.collection.findFirst({
    where: { id: collectionId, userId },
    select: collectionSelect,
  });

  return collection ? toCollectionWithStats(collection) : null;
}
