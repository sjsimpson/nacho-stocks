# Nacho Stocks

A paper-trading playground for learning to invest. Built for classrooms: students trade real US stocks with play money, and teachers follow their progress.

Curious where it started? The original version (React + webpack, Express, MongoDB, Cloud Run) lives on the [`v1` branch](https://github.com/sjsimpson/nacho-stocks/tree/v1).

## Features

- Search US stocks, view price history, buy and sell at delayed market prices
- Portfolio with holdings, gain/loss, trade history, and value over time
- Free personal accounts: username only, email optional
- Classrooms: teachers request one, an admin approves it, students join with a code
- Teacher roster with each student's value and return, read-only portfolio view, username moderation, and password resets
- Admin dashboard: review requests, manage classrooms, view the app as any user

## Stack

TanStack Start, TanStack Router/Query/Table, shadcn/ui (Base UI), Tailwind, Postgres + Drizzle, BetterAuth, Eulerpool, Upstash Redis, Inngest. Deployed on Vercel.

## Local development

Requires Node 22+, pnpm, and Docker.

```sh
pnpm install
cp .env.example .env        # fill in BETTER_AUTH_SECRET and EULERPOOL_API_KEY
docker compose up -d        # Postgres
pnpm db:migrate
pnpm dev                    # http://localhost:3000
pnpm inngest:dev            # optional: run background jobs (http://localhost:8388)
pnpm admin:grant <username> # make yourself an admin locally
```

Checks: `pnpm typecheck && pnpm lint && pnpm test`.

## Deploying to Vercel

1. Create a Vercel project from this repo. Vercel detects TanStack Start + Nitro.
2. Add integrations from the Vercel Marketplace: **Neon** (sets `DATABASE_URL`), **Upstash Redis** (sets `UPSTASH_REDIS_REST_*`), **Inngest** (sets `INNGEST_*` and syncs `/api/inngest`).
3. Set `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` (the production URL), `EULERPOOL_API_KEY`, `RESEND_API_KEY`, and `EMAIL_FROM`. Verify your sending domain in Resend (DNS records).
4. Deploy. Vercel runs `vercel-build`, which applies pending migrations before building. Enable Neon preview branches in the integration so preview deploys migrate their own branch, not production.
5. Sign up on the deployed site, verify your email, then make yourself admin: `DATABASE_URL=... pnpm admin:grant <username>`. Manage other admins from `/admin` > Users.

Market data by [Eulerpool](https://eulerpool.com). For education only, not investment advice.
