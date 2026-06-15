# Public demo deployment (Verno maintainers)

One-time setup for the shared demo at [whoopy.vercel.app](https://whoopy.vercel.app).

## WHOOP Developer App (Verno-owned)

1. Create an app at [developer.whoop.com](https://developer.whoop.com).
2. Redirect URI: `https://whoopy.vercel.app/api/auth/callback` (update if the Vercel URL changes).
3. Scopes: `offline`, `read:recovery`, `read:cycles`, `read:workout`, `read:sleep`, `read:profile`, `read:body_measurement`.

## Vercel project

| Setting        | Value      |
| -------------- | ---------- |
| Root Directory | `apps/web` |
| Framework      | Next.js    |

`vercel.json` in `apps/web` already sets monorepo install/build commands.

## Environment variables

Set on **Production** and **Preview**:

| Variable              | Value                                              |
| --------------------- | -------------------------------------------------- |
| `WHOOP_CLIENT_ID`     | Verno WHOOP app client ID                          |
| `WHOOP_CLIENT_SECRET` | Verno WHOOP app client secret                      |
| `SESSION_SECRET`      | `openssl rand -base64 32` (unique per environment) |

`WHOOP_REDIRECT_URI` is optional while using the default `*.vercel.app` domain. Set it if you attach a custom domain.

## Deploy

From the repo root (requires [Vercel CLI](https://vercel.com/docs/cli) and project link):

```bash
cd apps/web
vercel link
vercel env pull .env.local   # optional, for local parity
vercel --prod
```

Or connect the GitHub repo in the Vercel dashboard and enable automatic deployments on push to `main`.

## Verify

1. **Connect with WHOOP** completes OAuth and lands on `/dashboard`.
2. Dashboard loads recovery, sleep, cycles, and workout data.
