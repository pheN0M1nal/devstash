import {
  Code,
  File,
  Image,
  Link,
  Sparkles,
  StickyNote,
  Terminal,
  type LucideIcon,
} from 'lucide-react';
import type { ItemTypeName } from '@/lib/mock-data';

export const ITEM_TYPE_ICONS: Record<ItemTypeName, LucideIcon> = {
  snippet: Code,
  prompt: Sparkles,
  command: Terminal,
  note: StickyNote,
  file: File,
  image: Image,
  link: Link,
};

export const ITEM_TYPE_COLORS: Record<ItemTypeName, string> = {
  snippet: '#3b82f6',
  prompt: '#8b5cf6',
  command: '#f97316',
  note: '#fde047',
  file: '#6b7280',
  image: '#ec4899',
  link: '#10b981',
};

/** Singular label shown on item rows and badges. */
export const ITEM_TYPE_LABELS: Record<ItemTypeName, string> = {
  snippet: 'Snippet',
  prompt: 'Prompt',
  command: 'Command',
  note: 'Note',
  file: 'File',
  image: 'Image',
  link: 'Link',
};
