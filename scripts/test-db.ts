/**
 * Database smoke test.
 *
 * Runs outside Next.js, so environment variables are not loaded for us —
 * `dotenv/config` reads .env before src/lib/prisma.ts looks for DATABASE_URL.
 *
 * Exercises the same runtime path the app uses: the pooled Neon connection
 * through the driver adapter, not the direct URL the Prisma CLI uses.
 *
 * Run with: npm run db:test
 */
import "dotenv/config";
import { prisma } from "@/lib/prisma";

const EXPECTED_SYSTEM_TYPES = [
  "command",
  "file",
  "image",
  "link",
  "note",
  "prompt",
  "snippet",
];

async function main() {
  console.log("Testing database connection...\n");

  await prisma.$queryRaw`SELECT 1`;
  console.log("connection: ok\n");

  const types = await prisma.itemType.findMany({
    where: { isSystem: true },
    orderBy: { name: "asc" },
    select: { name: true, icon: true, color: true, userId: true },
  });

  console.log(`system item types: ${types.length}`);
  for (const t of types) {
    console.log(
      `  ${t.name.padEnd(9)} ${t.icon.padEnd(11)} ${t.color}  userId=${t.userId}`,
    );
  }

  const names = types.map((t) => t.name);
  const missing = EXPECTED_SYSTEM_TYPES.filter((n) => !names.includes(n));
  const duplicates = names.filter((n, i) => names.indexOf(n) !== i);

  console.log("\nrow counts:", {
    users: await prisma.user.count(),
    items: await prisma.item.count(),
    collections: await prisma.collection.count(),
    tags: await prisma.tag.count(),
  });

  if (missing.length > 0) {
    throw new Error(
      `missing system item types: ${missing.join(", ")} — run \`npm run db:seed\``,
    );
  }

  // The seed is idempotent; duplicates would mean it inserted instead of updating.
  if (duplicates.length > 0) {
    throw new Error(`duplicate system item types: ${duplicates.join(", ")}`);
  }

  console.log("\nAll checks passed.");
}

main()
  .catch((e) => {
    console.error("\nFAILED:", e instanceof Error ? e.message : e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
