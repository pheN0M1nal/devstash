'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronsUpDown, Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ITEM_TYPE_ICONS } from '@/lib/constants/item-types';
import { getInitials } from '@/lib/format';
import {
  currentUser,
  favoriteCollections,
  itemTypes,
  recentCollections,
  type Collection,
} from '@/lib/mock-data';
import { cn } from '@/lib/utils';

interface SidebarNavProps {
  /** Icon-only rail. Never set on the mobile drawer. */
  collapsed?: boolean;
  /** Called after a link is followed, so the mobile drawer can close itself. */
  onNavigate?: () => void;
}

export function SidebarNav({ collapsed = false, onNavigate }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <ScrollArea className="flex-1">
        <nav className="flex flex-col gap-6 p-3">
          <Section title="Types" collapsed={collapsed}>
            {itemTypes.map((type) => {
              const Icon = ITEM_TYPE_ICONS[type.name];
              return (
                <NavLink
                  key={type.id}
                  href={type.href}
                  label={type.label}
                  active={pathname === type.href}
                  collapsed={collapsed}
                  onNavigate={onNavigate}
                >
                  <Icon
                    className="size-4 shrink-0"
                    style={{ color: type.color }}
                    aria-hidden
                  />
                </NavLink>
              );
            })}
          </Section>

          <CollectionSection
            title="Favorites"
            collections={favoriteCollections}
            collapsed={collapsed}
            pathname={pathname}
            onNavigate={onNavigate}
            showStar
          />

          <CollectionSection
            title="Recent"
            collections={recentCollections}
            collapsed={collapsed}
            pathname={pathname}
            onNavigate={onNavigate}
          />
        </nav>
      </ScrollArea>

      <Separator />
      <UserArea collapsed={collapsed} />
    </div>
  );
}

function Section({
  title,
  collapsed,
  children,
}: {
  title: string;
  collapsed: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      {collapsed ? (
        <Separator className="mb-1" />
      ) : (
        <h3 className="px-2 pb-1 text-[0.7rem] font-medium tracking-wider text-muted-foreground uppercase">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}

function CollectionSection({
  title,
  collections,
  collapsed,
  pathname,
  onNavigate,
  showStar = false,
}: {
  title: string;
  collections: Collection[];
  collapsed: boolean;
  pathname: string;
  onNavigate?: () => void;
  showStar?: boolean;
}) {
  if (collections.length === 0) return null;

  return (
    <Section title={title} collapsed={collapsed}>
      {collections.map((collection) => {
        const href = `/collections/${collection.id}`;
        return (
          <NavLink
            key={collection.id}
            href={href}
            label={collection.name}
            active={pathname === href}
            collapsed={collapsed}
            onNavigate={onNavigate}
            trailing={
              showStar ? (
                <Star className="size-3 shrink-0 fill-yellow-400 text-yellow-400" aria-hidden />
              ) : (
                <span className="text-xs text-muted-foreground tabular-nums">
                  {collection.itemCount}
                </span>
              )
            }
          >
            <span
              className="flex size-4 shrink-0 items-center justify-center rounded-sm bg-muted text-[0.6rem] font-semibold text-muted-foreground"
              aria-hidden
            >
              {collection.name[0]}
            </span>
          </NavLink>
        );
      })}
    </Section>
  );
}

function NavLink({
  href,
  label,
  active,
  collapsed,
  onNavigate,
  children,
  trailing,
}: {
  href: string;
  label: string;
  active: boolean;
  collapsed: boolean;
  onNavigate?: () => void;
  /** The leading icon or swatch. */
  children: React.ReactNode;
  trailing?: React.ReactNode;
}) {
  const link = (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'flex h-8 items-center gap-2.5 rounded-md px-2 text-sm transition-colors duration-150',
        collapsed && 'justify-center px-0',
        active
          ? 'bg-muted font-medium text-foreground'
          : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
      )}
    >
      {children}
      {!collapsed && (
        <>
          <span className="flex-1 truncate">{label}</span>
          {trailing}
        </>
      )}
    </Link>
  );

  if (!collapsed) return link;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{link}</TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}

function UserArea({ collapsed }: { collapsed: boolean }) {
  const avatar = (
    <Avatar className="size-7 shrink-0">
      {currentUser.image && <AvatarImage src={currentUser.image} alt="" />}
      <AvatarFallback className="text-xs">{getInitials(currentUser.name)}</AvatarFallback>
    </Avatar>
  );

  if (collapsed) {
    return (
      <div className="flex justify-center p-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <button type="button" className="rounded-full">
              {avatar}
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">{currentUser.name}</TooltipContent>
        </Tooltip>
      </div>
    );
  }

  return (
    <button
      type="button"
      className="flex items-center gap-2.5 p-3 text-left transition-colors duration-150 hover:bg-muted/50"
    >
      {avatar}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium">{currentUser.name}</span>
        <span className="block truncate text-xs text-muted-foreground">
          {currentUser.isPro ? 'Pro' : 'Free'}
        </span>
      </span>
      <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" aria-hidden />
    </button>
  );
}
