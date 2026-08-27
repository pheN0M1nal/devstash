# Current Feature

## Status

Completed

## Features

### Dashboard UI Phase 1 — Completed

See @context/features/dashboard-phase-1-spec.md

- ShadCN UI initialization and components
- ShadCN component installation
- Dashboard route at /dashboard
- Main dashboard layout and any global styles
- Dark mode by default
- Top bar with search and new item button (display only)
- Placeholder for sidebar and main area (superseded by phases 2 and 3)

### Dashboard UI Phase 2 — Completed

See @context/features/dashboard-phase-2-spec.md

- Collapsible sidebar
- Items/types with links to /items/TYPE (eg. /items/snippets)
- Favorite collections
- Most recent collections
- User avatar area at the bottom
- Drawer icon to open/close sidebar
- Always a drawer on mobile view

### Dashboard UI Phase 3 — Completed

See @context/features/dashboard-phase-3-spec.md

- The main area to the right
- Recent collections
- Pinned Items
- 10 Recent items
- 4 stats cards at the top for number of items, collections, favorite items and favorite collections (Not in screenshot)

## Goals

Build the full dashboard UI across three phases, using the screenshot references and the mock data file until the database is implemented.

## Notes

- Reference screenshot: @context/screenshots/dashboard-ui-main.png — **missing from the repo**; the layout was built from the ASCII layout and UI/UX guidelines in @context/project-overview.md instead. Worth a visual pass once the screenshot is added.
- Mock data: @src/lib/mock-data.ts (imported directly for now)
- Item type accent colors live in `@theme` in @src/app/globals.css; icon/color maps in @src/lib/constants/item-types.ts
- Sidebar links to `/items/[type]` and `/collections/[id]` — those routes do not exist yet and will 404 until built
- Dark mode is hard-coded via `class="dark"` on `<html>`; a theme toggle is a later feature

## History

- 2026-08-17 — Next.js 16 + Tailwind v4 scaffold, git repo initialized and pushed to `pheN0M1nal/devstash` (`8d01e6c`)
- 2026-08-27 — Dashboard UI phases 1–3: shadcn/ui init, dashboard shell (top bar + collapsible sidebar + mobile drawer), stats cards, recent collections, pinned items and recent items, backed by mock data
