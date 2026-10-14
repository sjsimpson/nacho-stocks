# Nacho Stocks

Paper-trading app for classrooms. Students trade real US stocks with play money ($10k start). Teachers create classes, share a join code, and view students' portfolios.

Single TanStack Start app (React 19, Vite, Nitro) deployed to Vercel. v1 (Express + Mongo + webpack) lives at tag `v1-final`.

## Stack

- TanStack Start + Router (file routes in `src/routes`), TanStack Query, TanStack Table **v9** (`useTable`, `tableFeatures`; not v8 APIs)
- shadcn/ui on **Base UI** (`render` prop, not `asChild`). Link-as-button needs `nativeButton={false}`.
- Tailwind v4, Recharts via shadcn charts, Sonner toasts, next-themes
- Postgres + Drizzle (Neon in prod, docker locally)
- BetterAuth: `username`, `admin`, `organization` plugins
- Resend email (logs to dev server console when `RESEND_API_KEY` unset)
- Eulerpool market data, Upstash Redis cache, Inngest jobs
- pnpm only

## Commands

- `docker compose up -d` - local Postgres
- `pnpm dev` - app on :4400 (`--strictPort`; must match `BETTER_AUTH_URL` or auth fails with "Invalid origin"). 300x ports are taken by work projects.
- `pnpm inngest:dev` - Inngest dev server on :8388 (8288 is used by other local projects)
- `pnpm typecheck`, `pnpm lint`, `pnpm test` (vitest, `src/**/*.test.ts`) - run all three before committing
- `pnpm db:generate` then `pnpm db:migrate` after schema changes. Vercel runs migrations on deploy (`vercel-build`), so keep migrations backward compatible with the running version.
- `pnpm auth:generate` - regenerate `src/db/auth-schema.ts` after BetterAuth config changes. It overwrites the file; re-add `.notNull()` on `cashCents`.
- `pnpm db:generate` prompts interactively on column renames; run it in a real terminal.
- `pnpm admin:grant <username|email>` - bootstrap the first admin (any DB via `DATABASE_URL`). Later admins: `/admin` > Users.

Env: copy `.env.example` to `.env`. Locally set `INNGEST_DEV=1`; Upstash optional (falls back to in-memory cache). Local test admin: `test@test.com` (username `test`).

## Layout

- `src/lib/server/*` - server-only: auth, db access, market data, cache, classes, portfolio, Inngest jobs. Never import from client components.
- `src/lib/fns/*` - `createServerFn` wrappers. Validate with zod, guard with `authed` middleware, delegate to `lib/server`.
- `src/lib/middleware.ts` - `authed` server fn middleware.
- `src/lib/queries.ts` - `queryOptions` factories. Route loaders `ensureQueryData`, components `useSuspenseQuery`.
- `src/lib/trading.ts`, `money.ts`, `username.ts` - pure, shared client/server, unit tested.
- `src/db/schema.ts` - app tables. `src/db/auth-schema.ts` - generated BetterAuth tables.
- `src/routes/_authed.tsx` - auth guard + sidebar shell for signed-in pages.

## Rules

- **Client bundle leaks**: files imported by the client (`fns/*`, route files, `middleware.ts`) must only reference server modules inside `.handler()` / `.server()` bodies. No module-level helpers that touch `lib/server`; put those in `lib/server`. API route files lazy-import server code inside handlers. After changes, `pnpm build` and grep `.output/public` for `pg`/`upstash` to confirm.
- Money is integer cents everywhere. Format with `formatCents`.
- Trades go through `executeTrade` (row-locked DB transaction). Don't update cash/positions elsewhere.
- Expected errors return `{ ok: false, error }` (see `lib/server/result.ts`); unexpected ones throw.
- Teacher-only server code must call `requireTeacher`; actions on a student must also check the student is a `member` of that class.
- Market data only via `market` in `lib/server/market` (cached). Swap providers by implementing `MarketDataProvider`.
- Semantic HTML: real `<main>/<nav>/<section>/<dl>/<table>`, labelled forms, `sr-only` captions.

## Domain

- One account type. Signup: username + password, email optional. No email = hidden placeholder `@students.invalid` (never emailed). Public `/api/auth/sign-up/email` is blocked; signup goes through `signUpFn`.
- Teacher = owner/admin member of a classroom. No global teacher flag.
- Classroom = BetterAuth organization. Users can't create them (`allowUserToCreateOrganization: false`). Flow: user with verified email submits `classroom_request` -> admin approves on `/admin` -> `createClass(name, ownerId)` (server call without headers = system action) -> teacher emailed.
- Admin = `user.role === 'admin'` (DB is the only source). Granted via `pnpm admin:grant` or by another admin on `/admin` (`setAdmin`: needs verified email, can't change own role). Admins can manage any classroom, impersonate users, and get classroom-request emails. No permission system yet; checks live in `requireAdmin` / `requireTeacher`.
- Students join by `organization.joinCode`. `MAX_CLASSES_PER_STUDENT` in `lib/constants.ts` (default 1).
- One portfolio per user; class membership only grants teachers read access.
- Teachers can rename students and reset passwords; both logged to `student_audit`. Users with email can also reset via `/forgot-password`.
- `snapshot-portfolios` Inngest cron (weekdays 4:30pm ET) writes `price_snapshot` + `portfolio_snapshot`; powers value-over-time charts. Idempotent per date.
- Eulerpool free tier: non-commercial, quotes delayed 15m, "Data by Eulerpool" attribution required (footer).
- Locally, another project's Inngest dev server may poll this app and log "Failed to register" every few seconds unless `pnpm inngest:dev` is running. Harmless.
