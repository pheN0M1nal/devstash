import {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  File,
  Image,
  Link,
  type LucideIcon,
} from "lucide-react";

/**
 * Maps the `icon` value stored on an ItemType record to its Lucide component.
 */
export const ITEM_TYPE_ICONS: Record<string, LucideIcon> = {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  File,
  Image,
  Link,
};

export const FALLBACK_TYPE_COLOR = "#6b7280";

export function getItemTypeIcon(icon: string): LucideIcon {
  return ITEM_TYPE_ICONS[icon] ?? File;
}
