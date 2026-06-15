# whoopy

Open-source WHOOP health dashboard UI. Connect your WHOOP account, explore recovery, sleep, strain, and workouts with interactive charts.

— Verno · Turborepo · Next.js

## Try the demo

[whoopy.vercel.app](https://whoopy.vercel.app) — public demo instance.

## Self-host on Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FPunGrumpy%2Fwhoopy&project-name=whoopy&root-directory=apps%2Fweb&env=WHOOP_CLIENT_ID%2CWHOOP_CLIENT_SECRET%2CSESSION_SECRET&envDescription=WHOOP%20OAuth%20credentials%20from%20developer.whoop.com&envLink=https%3A%2F%2Fdeveloper.whoop.com&demo-description=Open-source%20WHOOP%20dashboard%20UI&demo-title=Whoopy&demo-url=https%3A%2F%2Fwhoopy.vercel.app)

### 1. Create a WHOOP Developer App

1. Go to [developer.whoop.com](https://developer.whoop.com) and create an application.
2. Add a redirect URI that matches your deployment:
   - Local dev: `http://localhost:3000/api/auth/callback`
   - Vercel: `https://<your-project>.vercel.app/api/auth/callback` (auto-derived from `VERCEL_URL`)
   - Custom domain: set `WHOOP_REDIRECT_URI=https://your-domain.com/api/auth/callback` on Vercel
3. Enable scopes: `offline`, `read:recovery`, `read:cycles`, `read:workout`, `read:sleep`, `read:profile`, `read:body_measurement`

### 2. Deploy

1. Fork this repo (or use **Deploy with Vercel** above).
2. In Vercel project settings, set **Root Directory** to `apps/web` (the deploy button sets this automatically).
3. Add environment variables (Production and Preview):

| Variable              | Required | Description                                                             |
| --------------------- | -------- | ----------------------------------------------------------------------- |
| `WHOOP_CLIENT_ID`     | Yes      | Client ID from your WHOOP Developer App                                 |
| `WHOOP_CLIENT_SECRET` | Yes      | Client secret from your WHOOP Developer App                             |
| `SESSION_SECRET`      | Yes      | Random 32+ character string for session JWT (`openssl rand -base64 32`) |
| `WHOOP_REDIRECT_URI`  | No       | Override OAuth callback URL (needed for custom domains)                 |

4. Deploy, then confirm the redirect URI in the WHOOP portal matches your live URL.

Each self-hosted instance uses **your own** WHOOP Developer App credentials. Do not share `WHOOP_CLIENT_SECRET` across deployments.

## Develop locally

From the repo root:

```bash
cp apps/web/.env.example apps/web/.env
# Fill in WHOOP_CLIENT_ID, WHOOP_CLIENT_SECRET, SESSION_SECRET

bun dev
```

Open [http://localhost:3000](http://localhost:3000).

## Structure

```
whoopy
├── apps/web          # Next.js app (Vercel root directory)
└── packages/@whoopy/typescript-config
```

## Troubleshooting

**Redirect URI mismatch** — The callback URL in the WHOOP Developer Portal must exactly match what Whoopy sends. Check your deployment URL or set `WHOOP_REDIRECT_URI` explicitly for custom domains.

**401 after sign-in** — `SESSION_SECRET` must be set and consistent across deploys. Regenerate if sessions fail to decrypt.

**"Instance not configured" on home** — `WHOOP_CLIENT_ID` or `SESSION_SECRET` is missing from environment variables.

**WHOOP API errors** — Confirm all required scopes are enabled on your WHOOP app and that the app is approved for production use if required by WHOOP.

## Links

- [Verno Studio](https://github.com/verno-studio/website)
- [Turborepo](https://turborepo.dev/docs)
- [WHOOP Developer Portal](https://developer.whoop.com)
- [Public demo deployment guide](apps/web/DEPLOY.md) (Verno maintainers)
