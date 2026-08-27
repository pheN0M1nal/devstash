import type { Metadata } from 'next';
import { CollectionCard } from '@/components/dashboard/CollectionCard';
import { ItemRow } from '@/components/dashboard/ItemRow';
import { Section } from '@/components/dashboard/Section';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { Card } from '@/components/ui/card';
import {
  currentUser,
  dashboardStats,
  pinnedItems,
  recentCollections,
  recentItems,
} from '@/lib/mock-data';

export const metadata: Metadata = {
  title: 'Dashboard | DevStash',
};

export default function DashboardPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 p-4 sm:p-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">
          Welcome back, {currentUser.name.split(' ')[0]}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Everything you stashed, one search away.
        </p>
      </div>

      <StatsCards stats={dashboardStats} />

      <Section title="Recent Collections">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {recentCollections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      </Section>

      {pinnedItems.length > 0 && (
        <Section title="Pinned Items">
          <Card className="gap-0 overflow-hidden p-0">
            <div className="divide-y">
              {pinnedItems.map((item) => (
                <ItemRow key={item.id} item={item} />
              ))}
            </div>
          </Card>
        </Section>
      )}

      <Section title="Recent Items">
        <Card className="gap-0 overflow-hidden p-0">
          <div className="divide-y">
            {recentItems.map((item) => (
              <ItemRow key={item.id} item={item} />
            ))}
          </div>
        </Card>
      </Section>
    </div>
  );
}
