# ops-tools

Operator-facing tools (transaction export, read/write payments DB viewer) for CitrineOS.

Runs as a standalone Next.js app with its own Keycloak-backed login — not embedded
in Operator-UI or Directus. SSO with citrineos-operator-ui works because both apps
authenticate against the same Keycloak realm (`AI-Charge-Technologies`) and client
(`internal`): once a user has an active Keycloak session from one app, navigating
to the other doesn't prompt for credentials again.

## Layout

- `src/app/**` — the app: login (via NextAuth's built-in `/api/auth/signin`),
  `/export-transactions`, `/payments`
- `src/lib/auth.ts` — server-side session check used by the API routes
- `src/middleware.ts` — redirects unauthenticated requests to sign-in and forces
  re-login if Keycloak token refresh fails

## Run

```
pnpm install
pnpm run dev   # http://localhost:3100
```

See `.env.local.example` for the full variable list. `HASURA_ADMIN_SECRET` and
`NEXT_PUBLIC_API_URL` point at the same Hasura instance/DB citrineos-operator-ui
uses. `KEYCLOAK_CLIENT_SECRET` is the `internal` client's secret in Keycloak
realm `AI-Charge-Technologies` — same client Operator-UI uses.

## Deploy

1. `pnpm install && pnpm run build`
2. `pnpm run start`, reachable at whatever domain you register as a redirect URI
   on the `internal` Keycloak client (`{domain}/api/auth/callback/keycloak`)
