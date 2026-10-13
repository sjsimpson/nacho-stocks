# Nacho Stocks

A paper-trading playground for learning to invest. Built for classrooms: students trade real US stocks with play money, and teachers follow their progress.

## Features

- Search US stocks, view price history, buy and sell at delayed market prices
- Portfolio with holdings, gain/loss, trade history, and value over time
- Classes: teachers share a join code; students sign up with a username only (no email)
- Teacher roster with each student's value and return, read-only portfolio view, username moderation, and password resets

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
```

Checks: `pnpm typecheck && pnpm lint && pnpm test`.

## Deploying to Vercel

1. Create a Vercel project from this repo. Vercel detects TanStack Start + Nitro.
2. Add integrations from the Vercel Marketplace: **Neon** (sets `DATABASE_URL`), **Upstash Redis** (sets `UPSTASH_REDIS_REST_*`), **Inngest** (sets `INNGEST_*` and syncs `/api/inngest`).
3. Set `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` (the production URL), and `EULERPOOL_API_KEY`.
4. Run migrations against Neon: `vercel env pull .env.production.local` then `DATABASE_URL=... pnpm db:migrate`.

Market data by [Eulerpool](https://eulerpool.com). For education only, not investment advice.
