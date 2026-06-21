// Public landing page
import Link from "next/link";

const features = [
  {
    title: "AI Chat Interface",
    desc: "Streaming responses powered by Claude with a clean, modern chat UI.",
    icon: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z",
  },
  {
    title: "Auth & OAuth",
    desc: "Sign in with Google, GitHub, or email/password via NextAuth v5.",
    icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
  },
  {
    title: "Stripe Subscriptions",
    desc: "Free, Pro ($19/mo), and Enterprise ($99/mo) plans with billing portal.",
    icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
  },
  {
    title: "Rate Limiting",
    desc: "Free users get 10 AI requests/day. Paid plans get unlimited access.",
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  },
  {
    title: "PostgreSQL + Prisma",
    desc: "Full database with User, Account, Session, and AIUsage models.",
    icon: "M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4",
  },
  {
    title: "TypeScript + Tailwind",
    desc: "Fully typed codebase with a clean, customizable design system.",
    icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white" style={{ colorScheme: "light" }}>
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600">
              <span className="text-sm font-bold text-white">A</span>
            </div>
            <span className="font-bold text-gray-900">AISaaS</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">Sign in</Link>
            <Link href="/register" className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700 transition-colors">
              Get started free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-violet-50 border border-violet-100 px-4 py-1.5 mb-8">
          <div className="h-2 w-2 rounded-full bg-violet-500" />
          <span className="text-xs font-semibold text-violet-700">Powered by Claude AI</span>
        </div>
        <h1 className="text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
          The AI SaaS boilerplate<br />
          <span className="text-violet-600">you&apos;ve been waiting for</span>
        </h1>
        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
          Ship your AI product in days, not months. Full-stack Next.js template with auth, subscriptions, and AI chat ready to deploy.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/register" className="rounded-xl bg-violet-600 px-8 py-3.5 text-sm font-bold text-white hover:bg-violet-700 transition-colors shadow-lg shadow-violet-100">
            Start for free →
          </Link>
          <Link href="/login" className="rounded-xl border border-gray-200 px-8 py-3.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
            Sign in
          </Link>
        </div>
        <p className="mt-4 text-xs text-gray-400">No credit card required · Free plan available</p>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">Everything you need to ship</h2>
          <p className="text-gray-500 text-center mb-12">Production-ready features out of the box</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="rounded-2xl bg-white border border-gray-200 p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 mb-4">
                  <svg className="h-5 w-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={f.icon} />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">Simple pricing</h2>
          <p className="text-gray-500 text-center mb-12">Start free, scale when you grow</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Free", price: 0, features: ["10 AI requests/day", "Basic chat", "Community support"], cta: "Get started", href: "/register" },
              { name: "Pro", price: 19, features: ["Unlimited AI requests", "Priority support", "Advanced features"], cta: "Start Pro", href: "/register", highlight: true },
              { name: "Enterprise", price: 99, features: ["Everything in Pro", "API access", "Custom integrations", "Dedicated support"], cta: "Contact us", href: "/register" },
            ].map((plan) => (
              <div key={plan.name} className={`relative rounded-2xl border bg-white p-6 ${plan.highlight ? "border-violet-300 ring-1 ring-violet-200" : "border-gray-200"}`}>
                {plan.highlight && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-violet-600 px-3 py-0.5 text-xs font-bold text-white">Popular</span>}
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
                <Link href={plan.href} className={`block w-full rounded-xl py-2 text-center text-sm font-semibold transition-colors ${
                  plan.highlight ? "bg-violet-600 text-white hover:bg-violet-700" : "border border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}>{plan.cta}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-900 py-20">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to build your AI SaaS?</h2>
          <p className="text-gray-400 mb-8">Join developers shipping AI products with this template.</p>
          <Link href="/register" className="rounded-xl bg-violet-600 px-8 py-3.5 text-sm font-bold text-white hover:bg-violet-700 transition-colors">
            Get started for free →
          </Link>
        </div>
      </section>

      <footer className="border-t border-gray-100 py-8">
        <div className="mx-auto max-w-6xl px-6 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} AISaaS Template. Built with Next.js, Prisma, Stripe & Anthropic.
        </div>
      </footer>
    </div>
  );
}
