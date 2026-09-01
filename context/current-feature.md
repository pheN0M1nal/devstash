# Current Feature

## Status

Completed

## Features

### Seed Sample Data — Completed

See @context/features/seed-spec.md

Rewrite @prisma/seed.ts to seed demo data, not just the system item types:

- Demo user: `demo@devstash.io`, "Demo User", password `12345678` (bcryptjs, 12 rounds), `isPro: false`, `emailVerified` set
- The 7 system item types (keep the existing logic)
- 5 collections owned by the demo user, with 18 items total, joined via `ItemCollection`:
  - React Patterns — 3 TypeScript snippets
  - AI Workflows — 3 prompts
  - DevOps — 1 snippet, 1 command, 2 links
  - Terminal Commands — 4 commands
  - Design Resources — 4 links

Links use real URLs. Snippets/prompts/commands are `TEXT`, links are `URL`.

## Goals

Give the dashboard real data so it can move off @src/lib/mock-data.ts.

## Notes

- Install `bcryptjs` and `@types/bcryptjs` — not currently in package.json.
- Data only, no schema change, no migration.
- Seed must stay idempotent: `npm run db:seed` twice should not duplicate rows. `Collection.name` and `Item.title` aren't unique, so no upsert — either look up by name/title + userId, or delete the demo user's collections and items first and recreate.
- Resolve item type ids after seeding types; every item needs `itemTypeId`.
- No tags — spec doesn't ask for them.
- A few items are marked `isPinned` / `isFavorite` and two collections `isFavorite`, so the dashboard's pinned and favorites sections aren't empty. Not in the spec — remove if unwanted.

## History

- 2026-08-17 — Next.js 16 + Tailwind v4 scaffold, git repo initialized and pushed to `pheN0M1nal/devstash` (`8d01e6c`)
- 2026-08-27 — Prisma + Neon database layer: Prisma 7.10.0 with the Neon driver adapter, full schema (9 models incl. NextAuth), initial migration `20260827155648_init` applied to the Neon dev branch, idempotent system-type seed, client singleton, and a `db:test` smoke test. Prisma 8 was requested but has no published client or adapter. Migrations only, never `db push`; the CLI needs the direct (unpooled) URL, which @prisma.config.ts derives by stripping `-pooler` from the host.
- 2026-08-27 — Dashboard UI phases 1–3 completed and merged to main (`be63a5c`, merge `0571a61`):
  - **Phase 1** (@context/features/dashboard-phase-1-spec.md) — shadcn/ui init and component installation, `/dashboard` route, main layout and global styles, dark mode by default, top bar with search and new-item button (display only)
  - **Phase 2** (@context/features/dashboard-phase-2-spec.md) — collapsible sidebar, item types linking to `/items/[type]`, favorite collections, most recent collections, user avatar area, drawer on mobile
  - **Phase 3** (@context/features/dashboard-phase-3-spec.md) — main area with recent collections, pinned items, 10 recent items, and 4 stats cards
  - Carried forward: reference screenshot `@context/screenshots/dashboard-ui-main.png` is still missing from the repo (layout built from the ASCII layout in project-overview.md instead); `/items/[type]` and `/collections/[id]` routes 404 until built; dark mode is hard-coded via `class="dark"` on `<html>`, theme toggle is a later feature
- 2026-09-01 — Seed sample data completed (@context/features/seed-spec.md):
  - Demo user `demo@devstash.io` / `12345678`, hashed with bcryptjs at 12 rounds
  - 7 system item types (existing logic kept)
  - 5 collections, 18 items: React Patterns (3 snippets), AI Workflows (3 prompts), DevOps (1 snippet, 1 command, 2 links), Terminal Commands (4 commands), Design Resources (4 links)
  - Added `bcryptjs` and `@types/bcryptjs`
  - Idempotent by deleting the demo user's items and collections each run and rebuilding — `Collection.name` and `Item.title` aren't unique, so there's nothing to upsert on
  - Verified: two consecutive `npm run db:seed` runs, then `npm run db:test` → 1 user, 5 collections, 18 items, 7 system types. Lint and build pass
