import Link from 'next/link';
import { Star } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ITEM_TYPE_COLORS } from '@/lib/constants/item-types';
import { formatRelativeTime } from '@/lib/format';
import type { Collection } from '@/lib/mock-data';

export function CollectionCard({ collection }: { collection: Collection }) {
  const accent = collection.defaultType
    ? ITEM_TYPE_COLORS[collection.defaultType]
    : 'var(--muted-foreground)';

  return (
    <Link href={`/collections/${collection.id}`} className="group">
      <Card className="h-full gap-0 p-4 transition-shadow duration-150 group-hover:shadow-md">
        <div className="flex items-start justify-between gap-2">
          <span
            className="size-2 shrink-0 translate-y-1.5 rounded-full"
            style={{ backgroundColor: accent }}
            aria-hidden
          />
          {collection.isFavorite && (
            <Star className="size-3.5 shrink-0 fill-yellow-400 text-yellow-400" aria-hidden />
          )}
        </div>

        <h3 className="mt-2 truncate text-sm font-medium">{collection.name}</h3>
        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
          {collection.description}
        </p>

        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          <span className="tabular-nums">
            {collection.itemCount} {collection.itemCount === 1 ? 'item' : 'items'}
          </span>
          <span aria-hidden>·</span>
          <span className="truncate">{formatRelativeTime(collection.updatedAt)}</span>
        </div>
      </Card>
    </Link>
  );
}
