import Link from 'next/link';
import { Pin, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ITEM_TYPE_COLORS, ITEM_TYPE_ICONS, ITEM_TYPE_LABELS } from '@/lib/constants/item-types';
import { formatFileSize, formatRelativeTime } from '@/lib/format';
import type { Item } from '@/lib/mock-data';

/** Single-line summary shown under the title. */
function subtitle(item: Item): string {
  if (item.contentType === 'URL' && item.url) return item.url;
  if (item.contentType === 'FILE' && item.fileName) {
    return item.fileSize
      ? `${item.fileName} · ${formatFileSize(item.fileSize)}`
      : item.fileName;
  }
  return item.description ?? item.content?.split('\n')[0] ?? '';
}

export function ItemRow({ item }: { item: Item }) {
  const Icon = ITEM_TYPE_ICONS[item.type];
  const color = ITEM_TYPE_COLORS[item.type];

  return (
    <Link
      href={`/items/${item.type}s`}
      className="flex items-center gap-3 px-4 py-3 transition-colors duration-150 hover:bg-muted/50"
    >
      <span
        className="flex size-8 shrink-0 items-center justify-center rounded-md"
        style={{ backgroundColor: `${color}1a` }}
        aria-hidden
      >
        <Icon className="size-4" style={{ color }} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5">
          <span className="truncate text-sm font-medium">{item.title}</span>
          {item.isPinned && (
            <Pin className="size-3 shrink-0 text-muted-foreground" aria-label="Pinned" />
          )}
          {item.isFavorite && (
            <Star
              className="size-3 shrink-0 fill-yellow-400 text-yellow-400"
              aria-label="Favorite"
            />
          )}
        </span>
        <span className="block truncate font-mono text-xs text-muted-foreground">
          {subtitle(item)}
        </span>
      </span>

      <Badge variant="secondary" className="hidden shrink-0 sm:inline-flex">
        {ITEM_TYPE_LABELS[item.type]}
      </Badge>

      <span className="hidden w-24 shrink-0 text-right text-xs text-muted-foreground md:block">
        {formatRelativeTime(item.updatedAt)}
      </span>
    </Link>
  );
}
