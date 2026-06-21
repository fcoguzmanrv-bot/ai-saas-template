# AISaaS — AI SaaS Template

A full-stack Next.js 16 boilerplate for building AI-powered SaaS products. Ships with authentication, Stripe subscriptions, Claude AI chat, and a production-ready dashboard.

## What's included

- **Next.js 16** App Router + TypeScript + Tailwind CSS
- **NextAuth v5** — Google, GitHub, and email/password login
- **Prisma 5** + PostgreSQL (Supabase, Neon, Railway, or any Postgres host)
- **Stripe** — Free / Pro ($19/mo) / Enterprise ($99/mo) subscriptions + billing portal
- **Anthropic Claude** — Streaming AI chat with `claude-sonnet-4-6`
- **Rate limiting** — Free users: 10 AI requests/day · Paid: unlimited
- **Webhook handler** — Syncs Stripe subscription status to your DB automatically

## Pages

| Route | Description |
|-------|-------------|
| `/` | Public landing page with features & pricing |
| `/login` | Sign in (OAuth + email/password) |
| `/register` | Create account |
| `/dashboard` | AI chat interface |
| `/billing` | Upgrade plan / manage subscription |
| `/settings` | Profile & account settings |

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

**Database (Supabase recommended)**
1. Create a free project at [supabase.com](https://supabase.com)
2. Go to Settings → Database → Connection string
3. Paste in `DATABASE_URL`

**NextAuth**
```bash
openssl rand -base64 32   # paste output into NEXTAUTH_SECRET
```

**Google OAuth**
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a project → APIs & Services → Credentials → OAuth 2.0 Client ID
3. Authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
4. Copy Client ID and Secret

**GitHub OAuth**
1. GitHub → Settings → Developer settings → OAuth Apps → New OAuth App
2. Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
3. Copy Client ID and Secret

**Stripe**
1. Create an account at [stripe.com](https://stripe.com)
2. Get API keys from your Stripe dashboard
3. Create two recurring prices (Pro: $19/mo, Enterprise: $99/mo) in Products
4. Set up webhook endpoint: `https://yourdomain.com/api/stripe/webhook`
   - Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
5. Copy the webhook signing secret

**Anthropic**
1. Get your API key at [console.anthropic.com](https://console.anthropic.com)

### 3. Set up the database

```bash
npx prisma db push
```

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy to Vercel

1. Push to GitHub
2. Import at [vercel.com/new](https://vercel.com/new)
3. Add all environment variables from `.env.local`
4. Set `NEXTAUTH_URL` to your production URL
5. Update Stripe webhook URL and OAuth redirect URIs to your production domain
6. Deploy!

## Customize

**Change the AI model** — Edit `lib/ai.ts`, update `AI_MODEL`

**Change the system prompt** — Edit `SYSTEM_PROMPT` in `lib/ai.ts`

**Change pricing** — Edit `lib/plans.ts` to update prices, limits, and features

**Change branding** — Search for "AISaaS" to rename · Replace `violet-600` with any Tailwind color

## Project structure

```
├── app/
│   ├── (auth)/login         # Login page
│   ├── (auth)/register      # Register page
│   ├── (dashboard)/         # Protected dashboard layout
│   │   ├── dashboard/       # AI chat
│   │   ├── billing/         # Subscription management
│   │   └── settings/        # Account settings
│   ├── api/
│   │   ├── auth/            # NextAuth + register endpoint
│   │   ├── ai/chat/         # Streaming AI endpoint
│   │   └── stripe/          # Checkout, webhook, portal
│   └── page.tsx             # Public landing page
├── components/
│   ├── chat/ChatInterface   # Streaming chat UI
│   └── dashboard/           # Sidebar, SettingsForm
├── lib/
│   ├── auth.ts              # NextAuth config
│   ├── db.ts                # Prisma client singleton
│   ├── ai.ts                # Anthropic client
│   ├── stripe.ts            # Stripe helpers
│   └── plans.ts             # Plan definitions & rate limiting
├── prisma/schema.prisma     # Database schema
├── proxy.ts                 # Route protection (Next.js 16)
└── .env.example             # Environment variable template
```
