import { prisma } from "@/lib/prisma";

const DEMO_USER_EMAIL = "demo@devstash.io";

/**
 * Resolves the user whose data the dashboard renders.
 *
 * TEMPORARY: NextAuth is not wired up yet, so this falls back to the seeded
 * demo user. Replace with the session lookup once auth lands.
 */
export async function getCurrentUser() {
  return prisma.user.findUnique({
    where: { email: DEMO_USER_EMAIL },
    select: { id: true, name: true, email: true, isPro: true },
  });
}
