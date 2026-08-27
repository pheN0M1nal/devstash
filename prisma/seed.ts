import "dotenv/config";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../src/generated/prisma/client";

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

async function main() {
  console.log("Seeding system item types...");

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
      console.log(`  updated  ${type.name}`);
    } else {
      await prisma.itemType.create({
        data: { ...type, isSystem: true, userId: null },
      });
      console.log(`  created  ${type.name}`);
    }
  }

  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
