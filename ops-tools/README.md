# ops-tools

Operator-facing tools (transaction export, read/write payments DB viewer) built as
an extension for `citrineos-operator-ui`'s generic extension slot system
(`public/extensions/*.json` + `/extensions/[id]`), rather than a Directus extension
like the other tools in this repo.

## Layout

- `src/app/**` — standalone Next.js app (works on its own: login, `/export-transactions`, `/payments`)
- `src/extension/panel.tsx` — the same features re-implemented as a plain React component
  (no Next.js, no bundled React/ReactDOM — uses the host's `window.React`/`window.ReactDOM`),
  built separately via `npm run build:extension` into `public/extension-bundle.js`.
  This is what Operator-UI actually loads and mounts.
- `src/lib/auth.ts` — accepts either a normal session cookie (standalone use) or a
  short-lived Bearer token minted by Operator-UI's `/api/extensions/token`
  (embedded use).

## Deploy

1. `npm install && npm run build && npm run build:extension`
2. Run it (`npm start`) reachable at whatever `internalUrl` you put in Operator-UI's
   `public/extensions/ops-tools.json` manifest.
3. `NEXTAUTH_SECRET` (and `HASURA_ADMIN_SECRET`, `NEXT_PUBLIC_API_URL`) must match
   citrineos-operator-ui's own values — this is what lets Operator-UI's proxy and
   token handoff work without a second login.

See `.env.local.example` for the full variable list.
