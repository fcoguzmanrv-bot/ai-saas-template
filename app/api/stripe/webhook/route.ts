// Stripe webhook handler — syncs subscription status to database
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { headers } from "next/headers";

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return Response.json({ error: "Missing signature" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET ?? "");
  } catch {
    return Response.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const userId = session.metadata?.userId;
        if (!userId || !session.subscription) break;

        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
        const priceId = subscription.items.data[0]?.price.id;
        const plan = priceId === process.env.STRIPE_ENTERPRISE_PRICE_ID ? "ENTERPRISE" : "PRO";

        await db.user.update({
          where: { id: userId },
          data: {
            plan,
            stripeSubscriptionId: subscription.id,
            subscriptionStatus: subscription.status as "active",
          },
        });
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        await db.user.updateMany({
          where: { stripeSubscriptionId: subscription.id },
          data: { plan: "FREE", stripeSubscriptionId: null, subscriptionStatus: null },
        });
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object;
        const priceId = subscription.items.data[0]?.price.id;
        const plan = priceId === process.env.STRIPE_ENTERPRISE_PRICE_ID ? "ENTERPRISE" : "PRO";

        await db.user.updateMany({
          where: { stripeSubscriptionId: subscription.id },
          data: { plan, subscriptionStatus: subscription.status as "active" },
        });
        break;
      }
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error("[STRIPE_WEBHOOK]", error);
    return Response.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
