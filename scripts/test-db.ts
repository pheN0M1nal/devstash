/**
 * Database smoke test.
 *
 * Runs outside Next.js, so environment variables are not loaded for us —
 * `dotenv/config` reads .env before src/lib/prisma.ts looks for DATABASE_URL.
 *
 * Exercises the same runtime path the app uses: the pooled Neon connection
 * through the driver adapter, not the direct URL the Prisma CLI uses.
 *
 * Checks the connection, the seven system item types, and the demo data
 * written by `npm run db:seed`.
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

const DEMO_EMAIL = "demo@devstash.io";

const EXPECTED_COLLECTIONS = [
  { name: "React Patterns", itemCount: 3 },
  { name: "AI Workflows", itemCount: 3 },
  { name: "DevOps", itemCount: 4 },
  { name: "Terminal Commands", itemCount: 4 },
  { name: "Design Resources", itemCount: 4 },
];

/** First line of a value, trimmed to fit one terminal row. */
function preview(value: string | null, max = 58): string {
  if (!value) return "";
  const [firstLine = ""] = value.split("\n");
  return firstLine.length > max ? `${firstLine.slice(0, max - 1)}…` : firstLine;
}

const problems: string[] = [];

function check(condition: boolean, message: string) {
  if (!condition) problems.push(message);
}

async function checkSystemItemTypes() {
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

  check(
    missing.length === 0,
    `missing system item types: ${missing.join(", ")} — run \`npm run db:seed\``,
  );
  // The seed is idempotent; duplicates would mean it inserted instead of updating.
  check(
    duplicates.length === 0,
    `duplicate system item types: ${duplicates.join(", ")}`,
  );
}

async function checkDemoData() {
  const user = await prisma.user.findUnique({
    where: { email: DEMO_EMAIL },
    include: {
      collections: {
        orderBy: { createdAt: "asc" },
        include: {
          items: {
            orderBy: { addedAt: "asc" },
            include: { item: { include: { itemType: true } } },
          },
        },
      },
    },
  });

  if (!user) {
    problems.push(`demo user ${DEMO_EMAIL} not found — run \`npm run db:seed\``);
    return;
  }

  console.log(`\ndemo user: ${user.email}`);
  console.log(`  name:          ${user.name}`);
  console.log(`  isPro:         ${user.isPro}`);
  console.log(`  emailVerified: ${user.emailVerified?.toISOString() ?? "null"}`);
  console.log(`  password:      ${user.password ? "bcrypt hash" : "not set"}`);

  check(
    user.password?.startsWith("$2") === true,
    "demo user password is not a bcrypt hash",
  );
  check(user.emailVerified !== null, "demo user emailVerified is not set");

  console.log(`\ncollections: ${user.collections.length}`);
  for (const collection of user.collections) {
    const star = collection.isFavorite ? " ★" : "";
    console.log(
      `\n  ${collection.name}${star} — ${collection.description ?? ""}`,
    );

    for (const { item } of collection.items) {
      const flags = [item.isPinned ? "📌" : "", item.isFavorite ? "★" : ""]
        .filter(Boolean)
        .join("");
      const body = item.url ?? preview(item.content);

      console.log(
        `    ${item.itemType.name.padEnd(8)} ${item.title.padEnd(38)} ${flags}`,
      );
      console.log(`      ${body}`);

      // Every item must carry the payload its content type promises.
      if (item.contentType === "TEXT") {
        check(
          Boolean(item.content),
          `item "${item.title}" is TEXT but has no content`,
        );
      }
      if (item.contentType === "URL") {
        check(
          item.url?.startsWith("http") === true,
          `item "${item.title}" is URL but has no valid url`,
        );
      }
    }
  }

  // Shape check against what the seed spec asks for.
  for (const expected of EXPECTED_COLLECTIONS) {
    const found = user.collections.filter((c) => c.name === expected.name);

    if (found.length === 0) {
      problems.push(`missing collection: ${expected.name}`);
      continue;
    }
    // Repeated seed runs must rebuild, not stack up.
    check(
      found.length === 1,
      `duplicate collection: ${expected.name} (${found.length} rows)`,
    );
    check(
      found[0].items.length === expected.itemCount,
      `collection "${expected.name}" has ${found[0].items.length} item(s), expected ${expected.itemCount}`,
    );
  }

  const orphaned = await prisma.item.count({
    where: { userId: user.id, collections: { none: {} } },
  });
  check(orphaned === 0, `${orphaned} demo item(s) belong to no collection`);
}

async function main() {
  console.log("Testing database connection...\n");

  await prisma.$queryRaw`SELECT 1`;
  console.log("connection: ok\n");

  await checkSystemItemTypes();
  await checkDemoData();

  console.log("\nrow counts:", {
    users: await prisma.user.count(),
    items: await prisma.item.count(),
    collections: await prisma.collection.count(),
    tags: await prisma.tag.count(),
  });

  if (problems.length > 0) {
    throw new Error(`\n  - ${problems.join("\n  - ")}`);
  }

  console.log("\nAll checks passed.");
}

main()
  .catch((e) => {
    console.error("\nFAILED:", e instanceof Error ? e.message : e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
