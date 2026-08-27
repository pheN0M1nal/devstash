/**
 * Mock data for the dashboard UI.
 * Imported directly until the database is implemented.
 *
 * Shapes mirror the Prisma models in @context/project-overview.md.
 */

export type ItemTypeName =
  | 'snippet'
  | 'prompt'
  | 'command'
  | 'note'
  | 'file'
  | 'image'
  | 'link';

export type ContentType = 'TEXT' | 'FILE' | 'URL';

export interface ItemType {
  id: string;
  name: ItemTypeName;
  label: string;
  /** Lucide icon name */
  icon: string;
  color: string;
  href: string;
  isSystem: boolean;
}

export interface Item {
  id: string;
  title: string;
  contentType: ContentType;
  content: string | null;
  url: string | null;
  fileName: string | null;
  fileSize: number | null;
  description: string | null;
  language: string | null;
  isFavorite: boolean;
  isPinned: boolean;
  type: ItemTypeName;
  tags: string[];
  collectionIds: string[];
  /** ISO 8601 */
  createdAt: string;
  /** ISO 8601 */
  updatedAt: string;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  isFavorite: boolean;
  defaultType: ItemTypeName | null;
  itemCount: number;
  /** ISO 8601 */
  createdAt: string;
  /** ISO 8601 */
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  image: string | null;
  isPro: boolean;
}

export interface DashboardStats {
  totalItems: number;
  totalCollections: number;
  favoriteItems: number;
  favoriteCollections: number;
}

export const currentUser: User = {
  id: 'user_1',
  name: 'Alex Rivera',
  email: 'alex@devstash.io',
  image: null,
  isPro: true,
};

export const itemTypes: ItemType[] = [
  {
    id: 'type_snippet',
    name: 'snippet',
    label: 'Snippets',
    icon: 'Code',
    color: '#3b82f6',
    href: '/items/snippets',
    isSystem: true,
  },
  {
    id: 'type_prompt',
    name: 'prompt',
    label: 'Prompts',
    icon: 'Sparkles',
    color: '#8b5cf6',
    href: '/items/prompts',
    isSystem: true,
  },
  {
    id: 'type_command',
    name: 'command',
    label: 'Commands',
    icon: 'Terminal',
    color: '#f97316',
    href: '/items/commands',
    isSystem: true,
  },
  {
    id: 'type_note',
    name: 'note',
    label: 'Notes',
    icon: 'StickyNote',
    color: '#fde047',
    href: '/items/notes',
    isSystem: true,
  },
  {
    id: 'type_file',
    name: 'file',
    label: 'Files',
    icon: 'File',
    color: '#6b7280',
    href: '/items/files',
    isSystem: true,
  },
  {
    id: 'type_image',
    name: 'image',
    label: 'Images',
    icon: 'Image',
    color: '#ec4899',
    href: '/items/images',
    isSystem: true,
  },
  {
    id: 'type_link',
    name: 'link',
    label: 'Links',
    icon: 'Link',
    color: '#10b981',
    href: '/items/links',
    isSystem: true,
  },
];

export const collections: Collection[] = [
  {
    id: 'col_react',
    name: 'React Patterns',
    description: 'Hooks, composition patterns and rendering tricks',
    isFavorite: true,
    defaultType: 'snippet',
    itemCount: 5,
    createdAt: '2026-05-02T09:12:00.000Z',
    updatedAt: '2026-08-24T16:40:00.000Z',
  },
  {
    id: 'col_context',
    name: 'Context Files',
    description: 'Reusable AI context and system messages',
    isFavorite: true,
    defaultType: 'prompt',
    itemCount: 4,
    createdAt: '2026-06-11T14:03:00.000Z',
    updatedAt: '2026-08-25T11:22:00.000Z',
  },
  {
    id: 'col_python',
    name: 'Python Snippets',
    description: 'Scripts, one-liners and data wrangling helpers',
    isFavorite: false,
    defaultType: 'snippet',
    itemCount: 3,
    createdAt: '2026-04-18T08:45:00.000Z',
    updatedAt: '2026-08-20T09:05:00.000Z',
  },
  {
    id: 'col_devops',
    name: 'DevOps Toolbox',
    description: 'Docker, git and shell commands worth keeping',
    isFavorite: true,
    defaultType: 'command',
    itemCount: 4,
    createdAt: '2026-03-27T17:30:00.000Z',
    updatedAt: '2026-08-23T13:18:00.000Z',
  },
  {
    id: 'col_interview',
    name: 'Interview Prep',
    description: 'Algorithms, system design notes and talking points',
    isFavorite: false,
    defaultType: null,
    itemCount: 3,
    createdAt: '2026-07-01T10:00:00.000Z',
    updatedAt: '2026-08-22T19:44:00.000Z',
  },
  {
    id: 'col_design',
    name: 'Design References',
    description: 'UI inspiration, palettes and screenshots',
    isFavorite: false,
    defaultType: 'link',
    itemCount: 3,
    createdAt: '2026-07-19T12:15:00.000Z',
    updatedAt: '2026-08-26T08:02:00.000Z',
  },
  {
    id: 'col_sql',
    name: 'SQL & Prisma',
    description: 'Query patterns, migrations and indexing notes',
    isFavorite: false,
    defaultType: 'snippet',
    itemCount: 2,
    createdAt: '2026-02-09T15:50:00.000Z',
    updatedAt: '2026-08-19T07:31:00.000Z',
  },
  {
    id: 'col_reading',
    name: 'Reading List',
    description: 'Articles and docs to get back to',
    isFavorite: false,
    defaultType: 'link',
    itemCount: 2,
    createdAt: '2026-01-22T20:10:00.000Z',
    updatedAt: '2026-08-15T18:55:00.000Z',
  },
];

export const items: Item[] = [
  {
    id: 'item_1',
    title: 'useAuth hook',
    contentType: 'TEXT',
    content:
      "import { useContext } from 'react';\nimport { AuthContext } from '@/context/auth';\n\nexport function useAuth() {\n  const ctx = useContext(AuthContext);\n  if (!ctx) throw new Error('useAuth must be used within AuthProvider');\n  return ctx;\n}",
    url: null,
    fileName: null,
    fileSize: null,
    description: 'Typed context consumer with a guard for missing provider',
    language: 'typescript',
    isFavorite: true,
    isPinned: true,
    type: 'snippet',
    tags: ['react', 'hooks', 'auth'],
    collectionIds: ['col_react'],
    createdAt: '2026-05-02T09:20:00.000Z',
    updatedAt: '2026-08-26T09:41:00.000Z',
  },
  {
    id: 'item_2',
    title: 'Code review prompt',
    contentType: 'TEXT',
    content:
      'You are a senior engineer reviewing a pull request. Focus on correctness, security and edge cases. For each finding, give the file, the concrete failure scenario, and a minimal fix. Skip style nits.',
    url: null,
    fileName: null,
    fileSize: null,
    description: 'General purpose PR review prompt',
    language: null,
    isFavorite: true,
    isPinned: true,
    type: 'prompt',
    tags: ['ai', 'review'],
    collectionIds: ['col_context'],
    createdAt: '2026-06-11T14:10:00.000Z',
    updatedAt: '2026-08-26T08:15:00.000Z',
  },
  {
    id: 'item_3',
    title: 'git reset --hard HEAD~1',
    contentType: 'TEXT',
    content: 'git reset --hard HEAD~1',
    url: null,
    fileName: null,
    fileSize: null,
    description: 'Drop the last commit and all its changes',
    language: 'bash',
    isFavorite: false,
    isPinned: true,
    type: 'command',
    tags: ['git'],
    collectionIds: ['col_devops'],
    createdAt: '2026-03-27T17:35:00.000Z',
    updatedAt: '2026-08-25T20:12:00.000Z',
  },
  {
    id: 'item_4',
    title: 'Tailwind v4 theme tokens',
    contentType: 'TEXT',
    content:
      '@import "tailwindcss";\n\n@theme {\n  --color-snippet: #3b82f6;\n  --color-prompt: #8b5cf6;\n  --color-command: #f97316;\n}',
    url: null,
    fileName: null,
    fileSize: null,
    description: 'CSS-first config for Tailwind v4',
    language: 'css',
    isFavorite: true,
    isPinned: false,
    type: 'snippet',
    tags: ['tailwind', 'css'],
    collectionIds: ['col_react', 'col_design'],
    createdAt: '2026-07-19T12:20:00.000Z',
    updatedAt: '2026-08-26T07:58:00.000Z',
  },
  {
    id: 'item_5',
    title: 'Prisma many-to-many with join table',
    contentType: 'TEXT',
    content:
      'model ItemCollection {\n  itemId       String\n  collectionId String\n  addedAt      DateTime @default(now())\n\n  @@id([itemId, collectionId])\n}',
    url: null,
    fileName: null,
    fileSize: null,
    description: 'Explicit join model when you need extra columns',
    language: 'prisma',
    isFavorite: false,
    isPinned: false,
    type: 'snippet',
    tags: ['prisma', 'database'],
    collectionIds: ['col_sql'],
    createdAt: '2026-02-09T16:00:00.000Z',
    updatedAt: '2026-08-25T17:30:00.000Z',
  },
  {
    id: 'item_6',
    title: 'Docker prune everything',
    contentType: 'TEXT',
    content: 'docker system prune -a --volumes',
    url: null,
    fileName: null,
    fileSize: null,
    description: 'Reclaim disk space — removes unused images and volumes',
    language: 'bash',
    isFavorite: false,
    isPinned: false,
    type: 'command',
    tags: ['docker', 'cleanup'],
    collectionIds: ['col_devops'],
    createdAt: '2026-03-28T09:05:00.000Z',
    updatedAt: '2026-08-25T14:47:00.000Z',
  },
  {
    id: 'item_7',
    title: 'Commit message generator',
    contentType: 'TEXT',
    content:
      'Given the following diff, write a conventional commit message. One line summary under 72 chars, then a short body explaining why the change was made.',
    url: null,
    fileName: null,
    fileSize: null,
    description: 'Conventional commits from a raw diff',
    language: null,
    isFavorite: false,
    isPinned: false,
    type: 'prompt',
    tags: ['ai', 'git'],
    collectionIds: ['col_context'],
    createdAt: '2026-06-12T09:30:00.000Z',
    updatedAt: '2026-08-25T10:20:00.000Z',
  },
  {
    id: 'item_8',
    title: 'Server Actions vs API routes',
    contentType: 'TEXT',
    content:
      '## When to use API routes\n\n- Webhooks (Stripe, GitHub)\n- File uploads with progress\n- Long-running operations\n- Specific status codes or headers\n- Endpoints for mobile/CLI clients\n\nEverything else: Server Actions.',
    url: null,
    fileName: null,
    fileSize: null,
    description: 'Decision notes for the Next.js data layer',
    language: null,
    isFavorite: true,
    isPinned: false,
    type: 'note',
    tags: ['nextjs', 'architecture'],
    collectionIds: ['col_react'],
    createdAt: '2026-05-14T11:25:00.000Z',
    updatedAt: '2026-08-24T21:09:00.000Z',
  },
  {
    id: 'item_9',
    title: 'shadcn/ui documentation',
    contentType: 'URL',
    content: null,
    url: 'https://ui.shadcn.com',
    fileName: null,
    fileSize: null,
    description: 'Component reference and install commands',
    language: null,
    isFavorite: true,
    isPinned: false,
    type: 'link',
    tags: ['ui', 'docs'],
    collectionIds: ['col_design', 'col_reading'],
    createdAt: '2026-07-20T13:40:00.000Z',
    updatedAt: '2026-08-24T15:33:00.000Z',
  },
  {
    id: 'item_10',
    title: 'Debounce with cleanup',
    contentType: 'TEXT',
    content:
      'export function useDebounced<T>(value: T, delay = 300) {\n  const [debounced, setDebounced] = useState(value);\n  useEffect(() => {\n    const t = setTimeout(() => setDebounced(value), delay);\n    return () => clearTimeout(t);\n  }, [value, delay]);\n  return debounced;\n}',
    url: null,
    fileName: null,
    fileSize: null,
    description: 'Debounce hook for search inputs',
    language: 'typescript',
    isFavorite: false,
    isPinned: false,
    type: 'snippet',
    tags: ['react', 'hooks'],
    collectionIds: ['col_react'],
    createdAt: '2026-05-30T10:05:00.000Z',
    updatedAt: '2026-08-24T12:18:00.000Z',
  },
  {
    id: 'item_11',
    title: 'Dashboard layout reference',
    contentType: 'FILE',
    content: null,
    url: null,
    fileName: 'dashboard-ui-main.png',
    fileSize: 284_910,
    description: 'Sidebar + main area reference for the dashboard build',
    language: null,
    isFavorite: false,
    isPinned: false,
    type: 'image',
    tags: ['design', 'dashboard'],
    collectionIds: ['col_design'],
    createdAt: '2026-07-21T09:50:00.000Z',
    updatedAt: '2026-08-23T16:27:00.000Z',
  },
  {
    id: 'item_12',
    title: 'Flatten a nested list',
    contentType: 'TEXT',
    content:
      'def flatten(items):\n    for item in items:\n        if isinstance(item, (list, tuple)):\n            yield from flatten(item)\n        else:\n            yield item',
    url: null,
    fileName: null,
    fileSize: null,
    description: 'Recursive generator, handles arbitrary depth',
    language: 'python',
    isFavorite: false,
    isPinned: false,
    type: 'snippet',
    tags: ['python'],
    collectionIds: ['col_python'],
    createdAt: '2026-04-18T08:55:00.000Z',
    updatedAt: '2026-08-23T11:04:00.000Z',
  },
  {
    id: 'item_13',
    title: 'Kill process on port 3000',
    contentType: 'TEXT',
    content: 'npx kill-port 3000',
    url: null,
    fileName: null,
    fileSize: null,
    description: 'When the dev server refuses to let go',
    language: 'bash',
    isFavorite: true,
    isPinned: false,
    type: 'command',
    tags: ['node', 'ports'],
    collectionIds: ['col_devops'],
    createdAt: '2026-03-29T14:12:00.000Z',
    updatedAt: '2026-08-22T18:40:00.000Z',
  },
  {
    id: 'item_14',
    title: 'System design: rate limiting',
    contentType: 'TEXT',
    content:
      '## Token bucket\n\nRefill R tokens/sec up to burst B. Each request takes one token.\n\nTrade-off vs sliding window: cheaper memory, allows short bursts.',
    url: null,
    fileName: null,
    fileSize: null,
    description: 'Talking points for the design round',
    language: null,
    isFavorite: false,
    isPinned: false,
    type: 'note',
    tags: ['system-design', 'interview'],
    collectionIds: ['col_interview'],
    createdAt: '2026-07-02T16:35:00.000Z',
    updatedAt: '2026-08-22T09:15:00.000Z',
  },
  {
    id: 'item_15',
    title: 'Project context template',
    contentType: 'FILE',
    content: null,
    url: null,
    fileName: 'project-context.md',
    fileSize: 12_480,
    description: 'Starting context file dropped into new repos',
    language: null,
    isFavorite: true,
    isPinned: false,
    type: 'file',
    tags: ['ai', 'template'],
    collectionIds: ['col_context'],
    createdAt: '2026-06-15T08:20:00.000Z',
    updatedAt: '2026-08-21T14:52:00.000Z',
  },
  {
    id: 'item_16',
    title: 'Explain this code prompt',
    contentType: 'TEXT',
    content:
      'Explain the following code to a developer who knows the language but not this codebase. Cover what it does, why it might be written this way, and any non-obvious edge cases.',
    url: null,
    fileName: null,
    fileSize: null,
    description: 'Used by the AI explain feature',
    language: null,
    isFavorite: false,
    isPinned: false,
    type: 'prompt',
    tags: ['ai'],
    collectionIds: ['col_context'],
    createdAt: '2026-06-16T10:45:00.000Z',
    updatedAt: '2026-08-21T10:03:00.000Z',
  },
  {
    id: 'item_17',
    title: 'Neon connection pooling',
    contentType: 'URL',
    content: null,
    url: 'https://neon.tech/docs/connect/connection-pooling',
    fileName: null,
    fileSize: null,
    description: 'Pooled vs direct connection strings for serverless',
    language: null,
    isFavorite: false,
    isPinned: false,
    type: 'link',
    tags: ['database', 'docs'],
    collectionIds: ['col_sql', 'col_reading'],
    createdAt: '2026-02-11T13:22:00.000Z',
    updatedAt: '2026-08-20T16:38:00.000Z',
  },
  {
    id: 'item_18',
    title: 'Read a CSV into a dict',
    contentType: 'TEXT',
    content:
      "import csv\n\nwith open('data.csv', newline='') as f:\n    rows = list(csv.DictReader(f))",
    url: null,
    fileName: null,
    fileSize: null,
    description: 'Stdlib only, no pandas needed',
    language: 'python',
    isFavorite: false,
    isPinned: false,
    type: 'snippet',
    tags: ['python', 'csv'],
    collectionIds: ['col_python'],
    createdAt: '2026-04-20T11:08:00.000Z',
    updatedAt: '2026-08-20T09:10:00.000Z',
  },
  {
    id: 'item_19',
    title: 'Behavioral question bank',
    contentType: 'TEXT',
    content:
      '- Hardest bug you shipped\n- Disagreement with a tech lead\n- A project you would build differently now',
    url: null,
    fileName: null,
    fileSize: null,
    description: 'STAR answers drafted for each',
    language: null,
    isFavorite: false,
    isPinned: false,
    type: 'note',
    tags: ['interview'],
    collectionIds: ['col_interview'],
    createdAt: '2026-07-05T19:00:00.000Z',
    updatedAt: '2026-08-18T20:25:00.000Z',
  },
  {
    id: 'item_20',
    title: 'Linear app design teardown',
    contentType: 'URL',
    content: null,
    url: 'https://linear.app',
    fileName: null,
    fileSize: null,
    description: 'Density, keyboard-first patterns, subtle borders',
    language: null,
    isFavorite: false,
    isPinned: false,
    type: 'link',
    tags: ['design', 'inspiration'],
    collectionIds: ['col_design'],
    createdAt: '2026-07-22T15:30:00.000Z',
    updatedAt: '2026-08-15T18:55:00.000Z',
  },
];

/** Items pinned to the top of the dashboard. */
export const pinnedItems: Item[] = items.filter((item) => item.isPinned);

/** Most recently updated items, newest first. */
export const recentItems: Item[] = [...items]
  .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))
  .slice(0, 10);

/** Favorited collections for the sidebar. */
export const favoriteCollections: Collection[] = collections.filter(
  (collection) => collection.isFavorite
);

/** Most recently updated collections, newest first. */
export const recentCollections: Collection[] = [...collections]
  .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))
  .slice(0, 5);

/** Counts for the four dashboard stats cards. */
export const dashboardStats: DashboardStats = {
  totalItems: items.length,
  totalCollections: collections.length,
  favoriteItems: items.filter((item) => item.isFavorite).length,
  favoriteCollections: favoriteCollections.length,
};

export function getItemType(name: ItemTypeName): ItemType | undefined {
  return itemTypes.find((type) => type.name === name);
}

export function getCollection(id: string): Collection | undefined {
  return collections.find((collection) => collection.id === id);
}
