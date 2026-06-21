"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { PLANS } from "@/lib/plans";

function BillingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const success = searchParams.get("success");
  const canceled = searchParams.get("canceled");

  async function handleUpgrade(priceId: string, planKey: string) {
    setLoading(planKey);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      setLoading(null);
    }
  }

  async function handlePortal() {
    setLoading("portal");
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      setLoading(null);
    }
  }

  const pricingPlans = [
    {
      key: "FREE",
      name: PLANS.FREE.name,
      price: PLANS.FREE.price,
      features: PLANS.FREE.features,
      cta: "Current plan",
      disabled: true,
    },
    {
      key: "PRO",
      name: PLANS.PRO.name,
      price: PLANS.PRO.price,
      features: PLANS.PRO.features,
      priceId: PLANS.PRO.priceId ?? "",
      cta: "Upgrade to Pro",
      highlight: true,
    },
    {
      key: "ENTERPRISE",
      name: PLANS.ENTERPRISE.name,
      price: PLANS.ENTERPRISE.price,
      features: PLANS.ENTERPRISE.features,
      priceId: PLANS.ENTERPRISE.priceId ?? "",
      cta: "Upgrade to Enterprise",
    },
  ];

  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Billing & Plans</h1>
      <p className="text-sm text-gray-500 mb-8">Choose the plan that fits your needs.</p>

      {success && (
        <div className="mb-6 rounded-xl bg-green-50 border border-green-100 p-4 text-sm text-green-700">
          Your subscription has been activated successfully!
        </div>
      )}
      {canceled && (
        <div className="mb-6 rounded-xl bg-yellow-50 border border-yellow-100 p-4 text-sm text-yellow-700">
          Checkout was canceled. No charges were made.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {pricingPlans.map((plan) => (
          <div key={plan.key} className={`relative rounded-2xl border bg-white p-6 ${
            plan.highlight ? "border-violet-300 ring-1 ring-violet-200" : "border-gray-200"
          }`}>
            {plan.highlight && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-violet-600 px-3 py-0.5 text-xs font-bold text-white">
                Most popular
              </span>
            )}
            <h3 className="font-bold text-gray-900 mb-1">{plan.name}</h3>
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
              {plan.price > 0 && <span className="text-sm text-gray-400">/mo</span>}
            </div>
            <ul className="flex flex-col gap-2 mb-6">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="h-4 w-4 flex-shrink-0 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
            {plan.disabled ? (
              <button disabled className="w-full rounded-xl border border-gray-200 py-2 text-sm font-medium text-gray-400">
                {plan.cta}
              </button>
            ) : (
              <button
                onClick={() => handleUpgrade(plan.priceId!, plan.key)}
                disabled={loading === plan.key}
                className={`w-full rounded-xl py-2 text-sm font-semibold transition-colors disabled:opacity-50 ${
                  plan.highlight
                    ? "bg-violet-600 text-white hover:bg-violet-700"
                    : "border border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}>
                {loading === plan.key ? "Loading..." : plan.cta}
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h3 className="font-bold text-gray-900 mb-1">Manage subscription</h3>
        <p className="text-sm text-gray-500 mb-4">Update payment method, view invoices, or cancel your subscription.</p>
        <button onClick={handlePortal} disabled={loading === "portal"}
          className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">
          {loading === "portal" ? "Loading..." : "Open billing portal"}
        </button>
      </div>
    </div>
  );
}

export default function BillingPage() {
  return (
    <Suspense>
      <BillingContent />
    </Suspense>
  );
}
