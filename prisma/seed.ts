import "dotenv/config";
import { PrismaNeon } from "@prisma/adapter-neon";
import bcrypt from "bcryptjs";
import { ContentType, PrismaClient } from "../src/generated/prisma/client";

const connectionString =
  process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL_UNPOOLED (or DATABASE_URL) is not set.");
}

const prisma = new PrismaClient({
  adapter: new PrismaNeon({ connectionString }),
});

const SYSTEM_ITEM_TYPES = [
  { name: "snippet", icon: "Code", color: "#3b82f6" },
  { name: "prompt", icon: "Sparkles", color: "#8b5cf6" },
  { name: "command", icon: "Terminal", color: "#f97316" },
  { name: "note", icon: "StickyNote", color: "#fde047" },
  { name: "file", icon: "File", color: "#6b7280" },
  { name: "image", icon: "Image", color: "#ec4899" },
  { name: "link", icon: "Link", color: "#10b981" },
] as const;

const DEMO_USER = {
  email: "demo@devstash.io",
  name: "Demo User",
  password: "12345678",
};

type SeedItem = {
  typeName: string;
  title: string;
  description: string;
  content?: string;
  url?: string;
  language?: string;
  isPinned?: boolean;
  isFavorite?: boolean;
};

type SeedCollection = {
  name: string;
  description: string;
  isFavorite?: boolean;
  items: SeedItem[];
};

const COLLECTIONS: SeedCollection[] = [
  {
    name: "React Patterns",
    description: "Reusable React patterns and hooks",
    isFavorite: true,
    items: [
      {
        typeName: "snippet",
        title: "useDebounce",
        description: "Debounce a rapidly changing value, e.g. a search input",
        language: "typescript",
        isPinned: true,
        content: `import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}`,
      },
      {
        typeName: "snippet",
        title: "Typed context provider",
        description:
          "Context + hook pair that throws instead of returning undefined",
        language: "typescript",
        isFavorite: true,
        content: `"use client";

import { createContext, useContext, useMemo, useState } from "react";

type Theme = "dark" | "light";

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const value = useMemo(() => ({ theme, setTheme }), [theme]);

  return <ThemeContext value={value}>{children}</ThemeContext>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used inside a ThemeProvider");
  }
  return context;
}`,
      },
      {
        typeName: "snippet",
        title: "formatBytes",
        description: "Human-readable file sizes for upload UIs",
        language: "typescript",
        content: `const UNITS = ["B", "KB", "MB", "GB", "TB"] as const;

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return "0 B";

  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    UNITS.length - 1,
  );
  const value = bytes / Math.pow(1024, exponent);

  return \`\${value.toFixed(exponent === 0 ? 0 : decimals)} \${UNITS[exponent]}\`;
}`,
      },
    ],
  },
  {
    name: "AI Workflows",
    description: "AI prompts and workflow automations",
    isFavorite: true,
    items: [
      {
        typeName: "prompt",
        title: "Code review",
        description: "Structured review pass over a diff",
        isPinned: true,
        content: `You are reviewing a pull request. Read the diff below and report only
problems you can point at a specific line for.

Cover, in this order:
1. Correctness — logic errors, unhandled edge cases, off-by-one, null paths
2. Security — missing auth checks, unvalidated input, leaked secrets
3. Performance — N+1 queries, unnecessary re-renders, work inside a loop
4. Consistency — does it match the patterns already in the file?

For each finding give: file:line, what breaks, and the smallest fix.
Skip style nits the formatter already handles. If a category is clean,
say so and move on.

Diff:
"""
{{diff}}
"""`,
      },
      {
        typeName: "prompt",
        title: "Generate documentation",
        description: "Turn a module into reference docs without inventing APIs",
        content: `Write reference documentation for the code below.

Rules:
- Document only what the code actually exports. Never invent parameters,
  options, or return fields.
- For each export: one-line summary, signature, parameter table, return
  value, and a realistic usage example.
- Note thrown errors and side effects (network, filesystem, global state).
- Use Markdown. No marketing language.
- If behaviour is genuinely unclear from the code, list it under
  "Open questions" instead of guessing.

Code:
"""
{{code}}
"""`,
      },
      {
        typeName: "prompt",
        title: "Refactoring assistant",
        description: "Behaviour-preserving cleanup with a stated plan first",
        content: `Refactor the code below without changing its observable behaviour.

Start by listing the changes you intend to make and why, ordered by
payoff. Then apply them.

Priorities:
- Remove duplication and dead code
- Name things for what they are, not how they work
- Split functions that do more than one job
- Replace clever expressions with obvious ones
- Keep the existing public API intact unless I say otherwise

Do not add features, dependencies, or abstractions used only once.
Call out anything you left alone because fixing it would change behaviour.

Code:
"""
{{code}}
"""`,
      },
    ],
  },
  {
    name: "DevOps",
    description: "Infrastructure and deployment resources",
    items: [
      {
        typeName: "snippet",
        title: "Multi-stage Dockerfile for Next.js",
        description: "Standalone output, non-root runtime, small final image",
        language: "dockerfile",
        content: `FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]`,
      },
      {
        typeName: "command",
        title: "Deploy: migrate, then release",
        description: "Apply pending migrations before the new build goes live",
        language: "bash",
        content: `npx prisma migrate deploy && npm run build && npm run start`,
      },
      {
        typeName: "link",
        title: "Dockerfile reference",
        description: "Every Dockerfile instruction, with examples",
        url: "https://docs.docker.com/reference/dockerfile/",
      },
      {
        typeName: "link",
        title: "GitHub Actions workflow syntax",
        description: "Triggers, jobs, matrices, and expression syntax",
        url: "https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax",
      },
    ],
  },
  {
    name: "Terminal Commands",
    description: "Useful shell commands for everyday development",
    items: [
      {
        typeName: "command",
        title: "Undo the last commit, keep the changes",
        description: "Moves HEAD back one commit and leaves the files staged",
        language: "bash",
        isPinned: true,
        content: `git reset --soft HEAD~1`,
      },
      {
        typeName: "command",
        title: "Reclaim Docker disk space",
        description:
          "Removes stopped containers, unused networks, dangling images and build cache",
        language: "bash",
        content: `docker system prune --all --volumes`,
      },
      {
        typeName: "command",
        title: "Kill whatever is holding a port",
        description: "The 'port 3000 is already in use' fix, macOS and Linux",
        language: "bash",
        content: `lsof -ti :3000 | xargs kill -9`,
      },
      {
        typeName: "command",
        title: "Find outdated packages",
        description: "List dependencies behind their latest published version",
        language: "bash",
        content: `npm outdated --long`,
      },
    ],
  },
  {
    name: "Design Resources",
    description: "UI/UX resources and references",
    items: [
      {
        typeName: "link",
        title: "Tailwind CSS docs",
        description: "Utility class reference and v4 theme configuration",
        url: "https://tailwindcss.com/docs",
        isFavorite: true,
      },
      {
        typeName: "link",
        title: "shadcn/ui",
        description: "Copy-in React components built on Radix and Tailwind",
        url: "https://ui.shadcn.com",
      },
      {
        typeName: "link",
        title: "Material Design 3",
        description: "Design system guidelines: color, type, motion, layout",
        url: "https://m3.material.io",
      },
      {
        typeName: "link",
        title: "Lucide icons",
        description: "The icon set DevStash uses for its item types",
        url: "https://lucide.dev/icons",
      },
    ],
  },
];

const CONTENT_TYPE_BY_ITEM_TYPE: Record<string, ContentType> = {
  snippet: ContentType.TEXT,
  prompt: ContentType.TEXT,
  command: ContentType.TEXT,
  note: ContentType.TEXT,
  file: ContentType.FILE,
  image: ContentType.FILE,
  link: ContentType.URL,
};

async function seedSystemItemTypes() {
  console.log("Seeding system item types...");
  const idByName = new Map<string, string>();

  for (const type of SYSTEM_ITEM_TYPES) {
    // Not an upsert: system types have userId = null, and Postgres unique
    // constraints treat NULLs as distinct, so `@@unique([name, userId])` can
    // neither match nor protect this row. Look it up explicitly instead.
    const existing = await prisma.itemType.findFirst({
      where: { name: type.name, userId: null },
    });

    if (existing) {
      await prisma.itemType.update({
        where: { id: existing.id },
        data: { icon: type.icon, color: type.color, isSystem: true },
      });
      idByName.set(type.name, existing.id);
      console.log(`  updated  ${type.name}`);
    } else {
      const created = await prisma.itemType.create({
        data: { ...type, isSystem: true, userId: null },
      });
      idByName.set(type.name, created.id);
      console.log(`  created  ${type.name}`);
    }
  }

  return idByName;
}

async function seedDemoUser() {
  console.log("\nSeeding demo user...");

  const password = await bcrypt.hash(DEMO_USER.password, 12);
  const user = await prisma.user.upsert({
    where: { email: DEMO_USER.email },
    update: { name: DEMO_USER.name, password, isPro: false },
    create: {
      email: DEMO_USER.email,
      name: DEMO_USER.name,
      password,
      isPro: false,
      emailVerified: new Date(),
    },
  });

  console.log(`  ${user.email}`);
  return user;
}

async function seedCollectionsAndItems(
  userId: string,
  itemTypeIds: Map<string, string>,
) {
  console.log("\nSeeding collections and items...");

  // Collection.name and Item.title are not unique, so there is no key to
  // upsert on. Clear this user's data and rebuild it — that is what keeps
  // repeated runs from stacking up duplicates. Item rows cascade to
  // item_collections, so the join table needs no separate delete.
  const { count: deletedItems } = await prisma.item.deleteMany({
    where: { userId },
  });
  const { count: deletedCollections } = await prisma.collection.deleteMany({
    where: { userId },
  });

  if (deletedItems > 0 || deletedCollections > 0) {
    console.log(
      `  cleared ${deletedItems} item(s) and ${deletedCollections} collection(s)`,
    );
  }

  for (const collection of COLLECTIONS) {
    const created = await prisma.collection.create({
      data: {
        name: collection.name,
        description: collection.description,
        isFavorite: collection.isFavorite ?? false,
        userId,
      },
    });

    for (const item of collection.items) {
      const itemTypeId = itemTypeIds.get(item.typeName);
      if (!itemTypeId) {
        throw new Error(`Unknown item type "${item.typeName}"`);
      }

      await prisma.item.create({
        data: {
          title: item.title,
          description: item.description,
          contentType: CONTENT_TYPE_BY_ITEM_TYPE[item.typeName],
          content: item.content ?? null,
          url: item.url ?? null,
          language: item.language ?? null,
          isPinned: item.isPinned ?? false,
          isFavorite: item.isFavorite ?? false,
          userId,
          itemTypeId,
          collections: { create: { collectionId: created.id } },
        },
      });
    }

    console.log(`  ${collection.name} — ${collection.items.length} item(s)`);
  }
}

async function main() {
  const itemTypeIds = await seedSystemItemTypes();
  const user = await seedDemoUser();
  await seedCollectionsAndItems(user.id, itemTypeIds);

  console.log("\nSeeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
