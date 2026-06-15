<a href="https://whoopy-beta.vercel.app">
  <h1 align="center">Whoopy</h1>
</a>

<p align="center">
  Whoopy is a free, open-source WHOOP health dashboard built with Next.js. Connect your WHOOP account and explore recovery, sleep, strain, and workouts with interactive charts and insights.
</p>

<p align="center">
  <a href="https://whoopy-beta.vercel.app"><strong>Live Demo</strong></a> ·
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#whoop-setup"><strong>WHOOP Setup</strong></a> ·
  <a href="#deploy-your-own"><strong>Deploy Your Own</strong></a> ·
  <a href="#running-locally"><strong>Running locally</strong></a>
</p>
<br/>

## Features

- [Next.js](https://nextjs.org) App Router
  - Server Components for fast page loads and secure session handling
  - API routes for WHOOP OAuth and live data fetching
- [WHOOP Developer API](https://developer.whoop.com)
  - OAuth 2.0 sign-in with token refresh
  - Recovery, sleep, strain (cycles), and workout data over a 90-day window
  - Stateless session stored in an encrypted JWT cookie — no database required
- [Recharts](https://recharts.org)
  - Interactive charts for home overview and per-domain analytics pages
  - Time range filtering (24h, 7d, 30d, 90d)
- [shadcn/ui](https://ui.shadcn.com)
  - Styling with [Tailwind CSS](https://tailwindcss.com)
  - Accessible components built on [Base UI](https://base-ui.com)
- Insights Engine
  - Rule-based health insights surfaced on the home dashboard and analytics pages
- [Turborepo](https://turborepo.dev)
  - Monorepo with shared TypeScript config

## WHOOP Setup

Each self-hosted instance needs its own [WHOOP Developer App](https://developer.whoop.com).

### Create a WHOOP Developer App

1. Create an application at [developer.whoop.com](https://developer.whoop.com).
2. Add a redirect URI that matches your deployment:
   - Local dev: `http://localhost:3000/api/auth/callback`
   - Vercel: `https://<your-project>.vercel.app/api/auth/callback` (auto-derived from `VERCEL_URL`)
   - Custom domain: set `WHOOP_REDIRECT_URI=https://your-domain.com/api/auth/callback`
3. Enable scopes: `offline`, `read:recovery`, `read:cycles`, `read:workout`, `read:sleep`, `read:profile`, `read:body_measurement`

### Environment Variables

| Variable              | Required | Description                                                             |
| --------------------- | -------- | ----------------------------------------------------------------------- |
| `WHOOP_CLIENT_ID`     | Yes      | Client ID from your WHOOP Developer App                                 |
| `WHOOP_CLIENT_SECRET` | Yes      | Client secret from your WHOOP Developer App                             |
| `SESSION_SECRET`      | Yes      | Random 32+ character string for session JWT (`openssl rand -base64 32`) |
| `WHOOP_REDIRECT_URI`  | No       | Override OAuth callback URL (needed for custom domains)                 |

Do not share `WHOOP_CLIENT_SECRET` across deployments. Each instance should use its own WHOOP app credentials.

## Deploy Your Own

You can deploy your own version of Whoopy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FPunGrumpy%2Fwhoopy&project-name=whoopy&root-directory=apps%2Fweb&env=WHOOP_CLIENT_ID%2CWHOOP_CLIENT_SECRET%2CSESSION_SECRET&envDescription=WHOOP%20OAuth%20credentials%20from%20developer.whoop.com&envLink=https%3A%2F%2Fdeveloper.whoop.com&demo-description=Open-source%20WHOOP%20dashboard%20UI&demo-title=Whoopy&demo-url=https%3A%2F%2Fwhoopy-beta.vercel.app)

Set **Root Directory** to `apps/web`, add the environment variables above, then confirm the redirect URI in the WHOOP portal matches your live URL.

## Running locally

You will need to use the environment variables [defined in `apps/web/.env.example`](apps/web/.env.example) to run Whoopy. It's recommended you use [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables) for production, but a local `.env` file is all that is necessary.

> Note: You should not commit your `.env` file or it will expose secrets that will allow others to access your WHOOP Developer App.

```bash
cp apps/web/.env.example apps/web/.env
# Fill in WHOOP_CLIENT_ID, WHOOP_CLIENT_SECRET, SESSION_SECRET

bun install
bun dev
```

Your app should now be running on [localhost:3000](http://localhost:3000).

## Troubleshooting

**Redirect URI mismatch** — The callback URL in the WHOOP Developer Portal must exactly match what Whoopy sends. Check your deployment URL or set `WHOOP_REDIRECT_URI` explicitly for custom domains.

**401 after sign-in** — `SESSION_SECRET` must be set and consistent across deploys. Regenerate if sessions fail to decrypt.

**"Instance not configured" on home** — `WHOOP_CLIENT_ID`, `WHOOP_CLIENT_SECRET`, or `SESSION_SECRET` is missing from environment variables.

**WHOOP API errors** — Confirm all required scopes are enabled on your WHOOP app and that the app is approved for production use if required by WHOOP.

## Links

- [WHOOP Developer Portal](https://developer.whoop.com)
- [Public demo deployment guide](apps/web/DEPLOY.md) (Verno maintainers)
- [Verno Studio](https://github.com/verno-studio/website)
- [Turborepo](https://turborepo.dev/docs)
