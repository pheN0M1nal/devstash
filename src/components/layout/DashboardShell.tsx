'use client';

import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { TooltipProvider } from '@/components/ui/tooltip';
import { SidebarNav } from '@/components/layout/SidebarNav';
import { TopBar } from '@/components/layout/TopBar';
import { cn } from '@/lib/utils';

/**
 * Dashboard chrome: top bar, sidebar (rail on desktop, drawer on mobile) and
 * the scrollable main area.
 */
export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <TooltipProvider>
      <div className="flex h-dvh flex-col">
        <TopBar
          onOpenDrawer={() => setDrawerOpen(true)}
          onToggleSidebar={() => setCollapsed((value) => !value)}
          sidebarCollapsed={collapsed}
        />

        <div className="flex min-h-0 flex-1">
          {/* Desktop rail — hidden below md, where the drawer takes over. */}
          <aside
            className={cn(
              'hidden shrink-0 border-r bg-sidebar transition-[width] duration-200 md:block',
              collapsed ? 'w-14' : 'w-64'
            )}
          >
            <SidebarNav collapsed={collapsed} />
          </aside>

          <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
            <SheetContent side="left" className="w-64 gap-0 p-0">
              <SheetHeader className="h-14 justify-center border-b px-3">
                <SheetTitle className="text-sm font-semibold tracking-tight">
                  DevStash
                </SheetTitle>
              </SheetHeader>
              <div className="min-h-0 flex-1">
                <SidebarNav onNavigate={() => setDrawerOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>

          <main className="min-w-0 flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </TooltipProvider>
  );
}
