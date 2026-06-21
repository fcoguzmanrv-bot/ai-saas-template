// Plan definitions, limits and access control logic
import { db } from "@/lib/db";

export const PLANS = {
  FREE: {
    name: "Free",
    price: 0,
    aiRequestsPerDay: 10,
    features: ["10 AI requests/day", "Basic chat interface", "Community support"],
  },
  PRO: {
    name: "Pro",
    price: 19,
    aiRequestsPerDay: Infinity,
    features: ["Unlimited AI requests", "Priority support", "Advanced features"],
    priceId: process.env.STRIPE_PRO_PRICE_ID,
  },
  ENTERPRISE: {
    name: "Enterprise",
    price: 99,
    aiRequestsPerDay: Infinity,
    features: ["Everything in Pro", "API access", "Custom integrations", "Dedicated support"],
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID,
  },
};

export async function checkAIAccess(userId: string): Promise<{ allowed: boolean; reason?: string; used?: number; limit?: number }> {
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) return { allowed: false, reason: "User not found" };

  if (user.plan !== "FREE") return { allowed: true };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const usage = await db.aIUsage.findUnique({
    where: { userId_date: { userId, date: today } },
  });

  const used = usage?.requestCount ?? 0;
  const limit = PLANS.FREE.aiRequestsPerDay;

  if (used >= limit) {
    return { allowed: false, reason: "Daily limit reached. Upgrade to Pro for unlimited requests.", used, limit };
  }

  return { allowed: true, used, limit };
}

export async function incrementAIUsage(userId: string): Promise<void> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  await db.aIUsage.upsert({
    where: { userId_date: { userId, date: today } },
    update: { requestCount: { increment: 1 } },
    create: { userId, date: today, requestCount: 1 },
  });
}
