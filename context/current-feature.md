# Current Feature

## Status

Completed

## Features

### Prisma + Neon PostgreSQL Setup — Completed

See @context/database-spec.md

- **Prisma 7.10.0** (not 8 — see Notes), with `@prisma/client` and `@prisma/adapter-neon` pinned to the same version
- @prisma.config.ts — CLI config: schema path, migrations path, seed command, direct + shadow datasource URLs
- @prisma/schema.prisma — User, Item, ItemType, Collection, ItemCollection, Tag, plus NextAuth Account/Session/VerificationToken
- @prisma/seed.ts — idempotent seed for the seven system item types
- @src/lib/prisma.ts — client singleton over the Neon driver adapter, hot-reload safe
- @scripts/test-db.ts — smoke test over the app's own runtime path (`npm run db:test`)
- `db:*` scripts in package.json; `postinstall` runs `prisma generate`
- Migration `20260827155648_init` created and applied to the Neon dev branch; seed run and verified idempotent

## Goals

Stand up the database layer so the dashboard can move off mock data. The schema will evolve — this is the initial migration, not the final shape.

## Notes

- **Prisma 8 is not installable yet.** The `prisma` CLI publishes `8.0.0-rc.12` as `latest`, but `@prisma/client` and `@prisma/adapter-neon` have no 8.x release at all — only `8.1.0-dev` nightlies. All three are pinned to **7.10.0** (released 2026-08-25). Revisit once the 8.0 client ships; it should be a version bump, not a rewrite.
- **Migrations only.** Never `prisma db push`. Use `npm run db:migrate` on the dev branch and `npm run db:deploy` for production.
- Prisma 7 differences from the spec's schema, all confirmed against the CLI:
  - `datasource` has **no `url`** — connection config lives in @prisma.config.ts (CLI) and in the driver adapter (runtime)
  - the generator provider is `prisma-client`, not `prisma-client-js`, and `output` is required
  - the generated client is **TypeScript source**, imported from `@/generated/prisma/client` — the `/client` suffix is required, there is no index file
  - `migrate dev` no longer runs `generate` or `db seed`; both are explicit follow-up steps
  - `migrate diff` renamed `--to-schema-datamodel` to `--to-schema`
  - `.env` is not auto-loaded; `import "dotenv/config"` in the config file does it
- **Pooled vs direct URLs.** The app uses the pooled `DATABASE_URL` through the driver adapter; the Prisma CLI needs a direct connection, because schema changes cannot run through Neon's pooler. Only `DATABASE_URL` is set in `.env`, so @prisma.config.ts derives the direct URL by stripping `-pooler` from the host. Setting `DATABASE_URL_UNPOOLED` explicitly overrides that.
- `SHADOW_DATABASE_URL` is unset and does not need to be: `migrate dev` created and dropped a temporary shadow database itself, since the Neon role may create databases. Set it only if that permission is ever revoked.
- The spec's seed used `upsert` on `where: { name_userId: { name, userId: null } }`. That cannot work — Postgres treats NULLs as distinct, so `@@unique([name, userId])` neither matches nor protects system types. @prisma/seed.ts does an explicit `findFirst` then create/update instead.
- `@db.Text` was dropped from the spec's String fields: on PostgreSQL, Prisma maps `String` to `text` by default, so it was a no-op.
- `Tag.name` is globally unique per the spec, so tags are shared across all users — one user's tags are visible to everyone. Worth revisiting when tagging is actually built.
- @src/lib/prisma.ts throws at module load when `DATABASE_URL` is missing. Nothing imports it yet so the build is unaffected, but watch for it during static generation once pages start querying.
- @src/lib/mock-data.ts stays until the dashboard is wired to real queries — a follow-up feature, not this one.
- `coding-standards.md` specifies Vitest and `npm run test`, but no test runner is installed and none was added here; out of scope for this feature.

## History

- 2026-08-17 — Next.js 16 + Tailwind v4 scaffold, git repo initialized and pushed to `pheN0M1nal/devstash` (`8d01e6c`)
- 2026-08-27 — Prisma + Neon database layer: Prisma 7.10.0 with the Neon driver adapter, full schema (9 models incl. NextAuth), initial migration `20260827155648_init` applied to the Neon dev branch, idempotent system-type seed, client singleton, and a `db:test` smoke test. Prisma 8 was requested but has no published client or adapter — see Notes.
- 2026-08-27 — Dashboard UI phases 1–3 completed and merged to main (`be63a5c`, merge `0571a61`):
  - **Phase 1** (@context/features/dashboard-phase-1-spec.md) — shadcn/ui init and component installation, `/dashboard` route, main layout and global styles, dark mode by default, top bar with search and new-item button (display only)
  - **Phase 2** (@context/features/dashboard-phase-2-spec.md) — collapsible sidebar, item types linking to `/items/[type]`, favorite collections, most recent collections, user avatar area, drawer on mobile
  - **Phase 3** (@context/features/dashboard-phase-3-spec.md) — main area with recent collections, pinned items, 10 recent items, and 4 stats cards
  - Carried forward: reference screenshot `@context/screenshots/dashboard-ui-main.png` is still missing from the repo (layout built from the ASCII layout in project-overview.md instead); `/items/[type]` and `/collections/[id]` routes 404 until built; dark mode is hard-coded via `class="dark"` on `<html>`, theme toggle is a later feature
