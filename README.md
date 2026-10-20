# MambyTech

Portfolio of **Ibrahima Mamby Bah**, Cloud Infrastructure & Linux Engineer: *Cloud infrastructure. Linux systems. Reliable delivery.*

Built with Next.js 16 (App Router), TypeScript, Tailwind CSS 4 and Zod, and deployed to Cloudflare Workers. Every page is statically rendered. There is no server-side code, no database, no forms, no cookies, and no third-party scripts. Contact goes through LinkedIn.

## Quick start

```bash
npm install
cp .env.example .env.local     # then edit; see below
npm run dev                    # http://localhost:3000
npm run dev:preview            # same, with drafts and unconfirmed content visible and labelled
```

| Script | Purpose |
| --- | --- |
| `npm run build` | Validate content, then make a production build |
| `npm start` | Serve the production build |
| `npm run content:check` | Validate content and list anything waiting on owner input |
| `npm test` | Unit tests (content rules, LinkedIn URL validation) |
| `npm run lint` / `npm run typecheck` | ESLint / TypeScript |
| `npm run e2e` | Browser checks against a running server; see `scripts/e2e.ts` |
| `npm run cf:preview` | Build for Cloudflare and serve it locally in the Workers runtime (http://localhost:8787) |
| `npm run cf:build` / `npm run cf:deploy` | Build for Cloudflare / deploy that build (used by Cloudflare's Git builds) |

**Editing content:** see [docs/CONTENT.md](docs/CONTENT.md).

## Structure

```
app/                 Routes: home, projects, about, contact (LinkedIn), privacy,
                     not-found, error, sitemap, robots, opengraph-image
components/          Header/nav, project entries, capabilities, closing band
components/figures/  The project diagrams: shared primitives, one file per figure,
                     and the full-size viewer
content/             Editable content: profile, about, projects/
lib/content/         Zod schemas, owner-input markers, loaders (preview/production gating)
public/aws-icons/    Official AWS Architecture Icons used by the diagrams
public/tool-icons/   Tool logos from Simple Icons (CC0) used by the diagrams
scripts/             content-check and the e2e browser checks
tests/               Vitest unit tests
```

## Configuration

All settings are environment variables, documented in [.env.example](.env.example).

- **Domain:** `NEXT_PUBLIC_SITE_URL` drives canonical URLs, the sitemap, robots.txt and social metadata. The production value (`https://mambytech.com`) is committed in `.env.production`.
- **Preview mode:** `CONTENT_PREVIEW=true` shows drafts with labels and sets `noindex` on every page plus `Disallow: /` in robots.txt. Never enable it on the public deployment.
- **Privacy page:** `HOSTING_PROVIDER_NAME` names the host on `/privacy`.

Environment variables are read at build time. Rebuild after changing them.

## Deployment: Cloudflare Workers

The site runs on Cloudflare Workers through the [OpenNext adapter](https://opennext.js.org/cloudflare) (`@opennextjs/cloudflare`). Every push to `main` builds and deploys automatically. Configuration:

- `wrangler.jsonc`: the Worker name (`mambytech`), the `nodejs_compat` flag, and the Cloudflare Images binding used by `next/image`.
- `open-next.config.ts`: prerendered pages are served from Workers static assets. Nothing revalidates, so no R2 bucket or KV namespace is needed.
- `patches/@opennextjs+cloudflare+1.20.10.patch`: the adapter doesn't yet bundle `preview-props.json`, a file Next.js 16.4 added, so every page fails without this patch ([opennextjs-cloudflare#1355](https://github.com/opennextjs/opennextjs-cloudflare/issues/1355)). `patch-package` applies it on every `npm install`. The adapter is pinned to the exact version the patch was made for. When an adapter release includes the fix, upgrade it, then delete the patch and the `postinstall` script.

**Cloudflare build settings:** build command `npm run cf:build`, deploy command `npm run cf:deploy`. `NEXT_PUBLIC_SITE_URL` and `HOSTING_PROVIDER_NAME` come from `.env.production`, so no dashboard variables are needed. Leave `CONTENT_PREVIEW` unset.

**Lock file:** Cloudflare installs with `npm ci` on npm 10. npm 11 can write a `package-lock.json` that npm 10 rejects as out of sync. If a Cloudflare build fails at *Installing* that way, regenerate the lock file with `npx npm@10 install`, then commit it.

**Custom domain:** `mambytech.com` and `www.mambytech.com` are attached under Worker → Settings → Domains & Routes. "Always Use HTTPS" is on in the zone's SSL/TLS settings.

**Local check before pushing:** `npm run cf:preview` serves the Cloudflare build at http://localhost:8787.

Security headers (`nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`) are set in `next.config.ts`.
