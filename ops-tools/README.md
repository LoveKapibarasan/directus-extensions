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

## Google Maps

The Locations page (list and create/edit) has a Google Maps integration
mirroring citrineos-operator-ui's: a click-to-pick location map on the
create/edit form (`src/lib/components/map/map-location-picker.tsx`, wired in
via the `map-point` field type in `src/lib/components/crud/resource-form.tsx`)
and a map view of all locations on the list page
(`src/lib/components/map/locations-list-map.tsx`, toggled against the table
view). Numeric latitude/longitude inputs stay available alongside the map for
precise entry.

`GOOGLE_MAPS_API_KEY` and `GOOGLE_MAPS_LOCATION_PICKER_MAP_ID` are read
server-side only and served to the map components through the auth-gated
`GET /api/maps-config` route — the key is never embedded in the client
bundle as a `NEXT_PUBLIC_*` var. Without a configured key, both map
components fall back to a plain message and the manual coordinate inputs
still work.

On boot (`src/instrumentation.ts`), the app checks Hasura's metadata for the
`payment_*` tables it needs and tracks any that exist in Postgres but aren't
yet exposed over GraphQL (`src/lib/server/ensure-hasura-tracked.ts`). This
covers a freshly migrated payments DB that hasn't had its tables tracked in
the Hasura console yet — otherwise every `payment_*` query 500s with
`field 'payment_x' not found in type: 'query_root'` until someone tracks
them by hand. It's a no-op once everything's already tracked, and never
fails startup — errors are logged and swallowed.

## i18n

UI strings are looked up from `src/lib/i18n/translations.ts` (`en` and `ja`)
through the `useTranslation()` hook from `src/lib/i18n/locale-provider.tsx`.
The selected locale is kept in `localStorage` and picked with the language
switcher in the header. To translate a new string, add its key to both
locales in `translations.ts` and call `t('your.key')` from a client
component under `<LocaleProvider>` (mounted in `src/lib/providers/index.tsx`).

## E2E tests

```
pnpm install
pnpm exec playwright install --with-deps chromium   # first run only
pnpm run test:e2e
```

Tests live in `e2e/` and run against the `generic` auth provider (a
hardcoded admin login, no Keycloak needed) — see `playwright.config.ts` for
the env it sets. `playwright test` builds and starts the app itself
(`webServer`), so no server needs to be running first. Use
`pnpm run test:e2e:ui` for Playwright's interactive UI mode while writing
tests.

## Deploy

1. `pnpm install && pnpm run build`
2. `pnpm run start`, reachable at whatever domain you register as a redirect URI
   on the `internal` Keycloak client (`{domain}/api/auth/callback/keycloak`)
