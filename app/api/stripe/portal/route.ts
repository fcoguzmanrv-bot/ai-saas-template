export const dynamic = "force-dynamic";

// Opens Stripe Customer Portal for subscription management
import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({ where: { id: session.user.id } });
    if (!user?.stripeCustomerId) {
      return Response.json({ error: "No subscription found" }, { status: 400 });
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${process.env.NEXTAUTH_URL}/billing`,
    });

    return Response.json({ url: portalSession.url });
  } catch (error) {
    console.error("[STRIPE_PORTAL]", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
