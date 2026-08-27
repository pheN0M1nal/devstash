import { FolderHeart, FolderOpen, Layers, Star } from 'lucide-react';
import { Card } from '@/components/ui/card';
import type { DashboardStats } from '@/lib/mock-data';

const STATS = [
  { key: 'totalItems', label: 'Items', icon: Layers },
  { key: 'totalCollections', label: 'Collections', icon: FolderOpen },
  { key: 'favoriteItems', label: 'Favorite Items', icon: Star },
  { key: 'favoriteCollections', label: 'Favorite Collections', icon: FolderHeart },
] as const satisfies ReadonlyArray<{
  key: keyof DashboardStats;
  label: string;
  icon: typeof Layers;
}>;

export function StatsCards({ stats }: { stats: DashboardStats }) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {STATS.map(({ key, label, icon: Icon }) => (
        <Card key={key} className="gap-0 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">{label}</span>
            <Icon className="size-4 text-muted-foreground" aria-hidden />
          </div>
          <span className="mt-2 text-2xl font-semibold tabular-nums">{stats[key]}</span>
        </Card>
      ))}
    </div>
  );
}
