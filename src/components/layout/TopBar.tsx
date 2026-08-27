'use client';

import Link from 'next/link';
import { PanelLeft, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface TopBarProps {
  /** Opens the drawer on mobile. */
  onOpenDrawer: () => void;
  /** Collapses/expands the rail on desktop. */
  onToggleSidebar: () => void;
  sidebarCollapsed: boolean;
}

export function TopBar({ onOpenDrawer, onToggleSidebar, sidebarCollapsed }: TopBarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b bg-background px-3 sm:px-4">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={onOpenDrawer}
        aria-label="Open sidebar"
      >
        <PanelLeft className="size-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="hidden md:inline-flex"
        onClick={onToggleSidebar}
        aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        aria-expanded={!sidebarCollapsed}
      >
        <PanelLeft className="size-4" />
      </Button>

      <Link href="/dashboard" className="mr-1 shrink-0 text-sm font-semibold tracking-tight">
        DevStash
      </Link>

      {/* Display only — search is wired up in a later feature. */}
      <div className="relative mx-auto w-full max-w-md">
        <Search
          className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          type="search"
          placeholder="Search items, collections, tags..."
          className="h-8 pl-8"
          aria-label="Search"
        />
      </div>

      <Button size="sm" className="shrink-0">
        <Plus className="size-4" />
        <span className="hidden sm:inline">New Item</span>
      </Button>
    </header>
  );
}
