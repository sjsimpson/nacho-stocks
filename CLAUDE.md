# Nacho Stocks

Paper-trading playground. Yarn workspaces monorepo (root package name `machu`).

- `packages/client` — React 18 + TS, webpack, SCSS, `m3-react` (own Material component lib). Port 3004 in docker.
- `packages/server` — Express + TS, Mongoose (MongoDB), Redis (sessions + Finnhub cache). Port 3003.

## Commands

- Full stack: `docker compose up` (client, server, mongo). Server reads root `.env`.
- Client: `yarn workspace machu-client dev` / `build`
- Server: `yarn workspace machu-server dev` (nodemon + ts-node) / `build` (tsc)
- No test suite or lint script. Verify with `yarn tsc --noEmit -p packages/<pkg>` (run `yarn install` first).
- Both `yarn.lock` and `package-lock.json` are committed. Prefer yarn.

## Env (root `.env`, gitignored)

`MONGO_URI`, `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`, `JWT_SECRET`, `FINNHUB_TOKEN`, `PORT`, `CLIENT_PORT`. Server throws on startup if Redis vars missing.

## Server layout

- `routes/*` — Express routers, mounted in `src/index.ts` (`/auth`, `/user`, `/stocks`, `/positions`, `/transactions`). Thin: parse req, call controller, map errors to status.
- `controllers/*` — business logic + DB access.
- `models/*` — Mongoose schemas. Shared types live in `src/types/*.d.ts` as globals (e.g. `Position`, `User`).
- `redis.ts` — singleton client via `useRedisClient()`.

## Client layout

- `api/api.ts` — single axios instance, `withCredentials: true`. Base URL from `client/config.js`.
- `queries/*` — all server calls go through `@tanstack/react-query` (v4) hooks here. Don't call `api` from components.
- `stores/*` — zustand for client-only state (`userStore`).
- `components/<Feature>/` — `Feature.tsx` + `Feature.scss` + `index.ts` barrel. Shared bits in `components/common`.
- `context/ToastProvider` — use `useToasts()` for user-facing errors.
- Global types in `src/types/*.d.ts`.

## Auth (in flux)

Migrating from JWT (`x-api-token` header, `middleware/verifyToken.ts`) to `express-session` cookies stored in Redis. `req.session.user` holds user id (typed in `types/session.d.ts`). New protected routes should use the session, not `verifyToken`. Commented-out JWT code is reference during migration.

## Gotchas

- `NODE_ENV` values differ: server uses `dev`/`prod`, client uses `development`/`production`. Session cookie `secure` checks `'production'`, so it's never true on server.
- Session secret is hardcoded and cookie `maxAge` is 60s (debug values).
- Finnhub responses cached in Redis; check cache before adding new Finnhub calls.

## Style

- Prettier: 2 spaces, no semicolons, single quotes.
- Conventional commits (`feat:`, `fix:`, `refactor:`), optional scope e.g. `feat(auth):`.
