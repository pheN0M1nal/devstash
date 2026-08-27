import "dotenv/config";
import { defineConfig } from "prisma/config";

// The Prisma CLI (migrate, db pull, studio) needs a DIRECT connection — schema
// changes cannot run through Neon's transaction pooler. The app itself uses the
// pooled DATABASE_URL via the driver adapter (see src/lib/prisma.ts).
//
// Neon's direct endpoint is the pooled one without the "-pooler" suffix, so we
// derive it when DATABASE_URL_UNPOOLED isn't set explicitly.
function directUrl(): string {
  const explicit = process.env["DATABASE_URL_UNPOOLED"];
  if (explicit) return explicit;

  const pooled = process.env["DATABASE_URL"];
  if (!pooled) {
    throw new Error("Neither DATABASE_URL_UNPOOLED nor DATABASE_URL is set.");
  }
  return pooled.replace("-pooler.", ".");
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: directUrl(),
    // migrate dev needs a shadow database to detect drift. If SHADOW_DATABASE_URL
    // is unset, Prisma creates and drops a temporary one itself, which works on
    // Neon because the role may create databases.
    shadowDatabaseUrl: process.env["SHADOW_DATABASE_URL"],
  },
});
