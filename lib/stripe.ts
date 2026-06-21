// Stripe client and helper functions
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2025-05-28.basil",
  typescript: true,
});

export async function getOrCreateStripeCustomer(userId: string, email: string): Promise<string> {
  const { db } = await import("@/lib/db");
  const user = await db.user.findUnique({ where: { id: userId } });

  if (user?.stripeCustomerId) return user.stripeCustomerId;

  const customer = await stripe.customers.create({ email, metadata: { userId } });

  await db.user.update({
    where: { id: userId },
    data: { stripeCustomerId: customer.id },
  });

  return customer.id;
}
