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

## Payments schema

Version 1.4.0 tracks the citrineos-payment v1.4 payments schema (payments
migration `0050`): every one of its 32 `payment_*` tables has a screen,
defined in `src/lib/resources/*.ts` and registered in
`src/lib/resources/index.ts`. The full table list lives in
`src/lib/paymentTables.ts`.

Most tables get list/create/edit. The exceptions:

- **Read-only lists** — system/audit data written by the payments backend or
  owned by the user: `payment_processed_stripe_events`,
  `payment_push_devices`, `payment_station_connection_attempts`,
  `payment_point_entries` (the points ledger; a balance is its sum),
  `payment_user_security_credentials`, `payment_user_notification_settings`.
- **List + edit, no create/delete** — `payment_host_cards` (see below).
- **List + create only** — `payment_shop_product_relations`, which has a
  composite primary key and no `id` column. Refine's Hasura data provider
  addresses rows by `id` only, so edit/delete aren't possible there (the same
  applies to `payment_user_notification_settings`, keyed by `user_id`).

Sensitive columns are never queried, listed or editable: station
`credential_hash`, host card `id_token`, push device `token`/`p256dh`/`auth`,
checkout `guest_session_hash` and `access_key_hash`, and the Keycloak `credential_id` of security
credentials. Photos and logos are shown as storage object keys (metadata
only), never as file contents.

Writes here go straight to the database. Changes that the payments backend
normally mirrors into CitrineOS — provisioning or revoking a station,
revoking a host card, an RFID card's status — are **not** synced to
CitrineOS when made from ops-tools.

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
`payment_*` tables it needs (`PAYMENT_TABLES` in `src/lib/paymentTables.ts`) and tracks any that exist in Postgres but aren't
yet exposed over GraphQL (`src/lib/server/ensure-hasura-tracked.ts`). This
covers a freshly migrated payments DB that hasn't had its tables tracked in
the Hasura console yet — otherwise every `payment_*` query 500s with
`field 'payment_x' not found in type: 'query_root'` until someone tracks
them by hand. It's a no-op once everything's already tracked, and never
fails startup — errors are logged and swallowed.

## i18n

UI strings are looked up from `src/lib/i18n/translations.ts` (`en`, `ja`,
`de`) through the `useTranslation()` hook from
`src/lib/i18n/locale-provider.tsx` (`t(key)`, or `t(key, {param})` for the
handful of keys with `{param}` placeholders, e.g. `common.pageOf`). The
selected locale is kept in `localStorage` and picked with the language
switcher in the header.

Coverage is meant to be complete — every CRUD screen (`src/lib/resources/*.ts`
column headers and form field labels, including `select` option labels via
`labelKey`), the shared table/form chrome (`resource-table.tsx`,
`resource-form.tsx`), and every other page under `src/app/(authenticated)`
go through translation keys, not literal strings. `ResourceColumn.header`,
`ResourceFormField.label`, and `ResourceForm`'s `title` prop are typed as
`TranslationKey`, so a literal string in any of those won't type-check —
that's deliberate, to keep new resources/pages from silently reintroducing
English-only text.

The one deliberate exception: `/consistency-check`'s per-finding messages
and caveats (`src/lib/server/consistency-check.ts`) are generated
server-side as full sentences mixing fixed wording with dynamic data (table
names, DB values) — translating those would mean restructuring the report
to emit structured data instead of pre-built strings. Only that page's
static chrome (headings, buttons, table headers, finding-kind badges) is
localized.

To translate a new string: add the same key to all three locale objects in
`translations.ts` (TypeScript errors if one is missing) and reference it via
a `TranslationKey`-typed prop or `t('your.key')`.

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
