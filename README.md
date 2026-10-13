# MambyTech

Personal technology portfolio of **Ibrahima Mamby Bah**: *Building Infrastructure. Engineering Solutions.*

Built with Next.js 16 (App Router), TypeScript, Tailwind CSS 4 and Zod. Every page is statically rendered. The only server-side code is the contact form's server action. There is no database, there are no visitor accounts, and the site loads no third-party scripts.

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
| `npm run content:check` | Validate content and list everything waiting on owner input |
| `npm test` | Unit tests (content rules, contact validation, spam checks, rate limiting, provider config) |
| `npm run lint` / `npm run typecheck` | ESLint / TypeScript |
| `npm run e2e` | Browser checks against a running server; see `scripts/e2e.ts` |
| `npm run cf:preview` | Build for Cloudflare and serve it locally in the Workers runtime (http://localhost:8787) |
| `npm run cf:build` / `npm run cf:deploy` | Build for Cloudflare / deploy that build (used by Cloudflare's Git builds) |

**Editing content:** see [docs/CONTENT.md](docs/CONTENT.md).

## Structure

```
app/                 Routes: home, about, projects, projects/[slug], contact, privacy,
                     not-found, error, sitemap, robots, opengraph-image
components/          Reusable UI: header/nav, project cards, skills, contact form
content/             Editable content: profile, about, projects/, writing/
lib/content/         Zod schemas, owner-input markers, loaders (preview/production gating)
lib/contact/         Validation, spam checks, rate limiting, provider config and delivery
scripts/             content-check and the e2e browser checks
tests/               Vitest unit tests
```

## Configuration

All settings are environment variables, documented in [.env.example](.env.example). Secrets are read only on the server, and `.env*.local` is git-ignored.

- **Domain:** set `NEXT_PUBLIC_SITE_URL`. It drives canonical URLs, the sitemap, robots.txt and social metadata. `mambytech.com` is preferred but is not yet confirmed or purchased.
- **Preview mode:** `CONTENT_PREVIEW=true` shows drafts with labels and sets `noindex` on every page plus `Disallow: /` in robots.txt. Never enable it on the public deployment.
- **Contact form:** `CONTACT_PROVIDER=resend` with `RESEND_API_KEY`, `CONTACT_TO_EMAIL` and `CONTACT_FROM_EMAIL`.
  - With no provider configured, the Contact page states that the form is unavailable instead of accepting messages that can't be delivered.
  - The site reports success only when Resend returns an accepted message ID.
  - `CONTACT_PROVIDER=mock` is for local development. Production builds refuse it.
- **Rate limiting:** 5 messages per 10 minutes per client, keyed by a salted hash of the IP address.
  - Set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` to share limits across serverless instances.
  - Without them, an in-memory limiter is used. That is reliable on one long-running server but only best-effort on serverless.
- **Spam protection:** a hidden honeypot field, a minimum fill time, input length limits, a cap of 3 links per message, and the rate limit. Next.js server actions also check the request origin.
- **Logging:** logs record only the provider name, HTTP status or error type. They never contain names, emails or message text.

Environment variables are read at build time for page content. Rebuild after changing them.

## Deployment: Cloudflare Workers

The site runs on Cloudflare Workers through the [OpenNext adapter](https://opennext.js.org/cloudflare) (`@opennextjs/cloudflare`). Configuration:

- `wrangler.jsonc`: the Worker name (`mambytech`), the `nodejs_compat` flag (needed for `node:crypto` and `process.env`) and the Cloudflare Images binding used by `next/image`.
- `open-next.config.ts`: prerendered pages are served from Workers static assets. Nothing revalidates, so no R2 bucket or KV namespace is needed.
- `patches/@opennextjs+cloudflare+1.20.10.patch`: the adapter doesn't yet bundle `preview-props.json`, a file Next.js 16.4 added, so every page fails without this patch ([opennextjs-cloudflare#1355](https://github.com/opennextjs/opennextjs-cloudflare/issues/1355)). `patch-package` applies it on every `npm install`. The adapter is pinned to the exact version the patch was made for. When an adapter release includes the fix, upgrade it, then delete the patch and the `postinstall` script.

**Connect the repository** in Cloudflare under Workers & Pages → Create application → Import a repository. Allow access to this repository only.

- Build command: `npm run cf:build`
- Deploy command: `npm run cf:deploy`

**Lock file:** Cloudflare installs with `npm ci` on npm 10. npm 11 can write a `package-lock.json` that npm 10 rejects as out of sync. If a Cloudflare build fails at *Installing* that way, regenerate the lock file with `npx npm@10 install`, then commit it.

**Environment variables.** Pages are prerendered, so the Contact and Privacy pages read their settings **during the build**, and the contact form reads them again **at runtime**. In the Worker's settings, add each value under *both* Build → Variables and secrets *and* Variables and secrets. Use the secret type for `RESEND_API_KEY` and `UPSTASH_REDIS_REST_TOKEN`.

| Variable | Value |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://mambytech.com` |
| `HOSTING_PROVIDER_NAME` | `Cloudflare` |
| `CONTACT_PROVIDER`, `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` | See `.env.example`. Leave these out until Resend is set up, and the Contact page will say the form is unavailable. |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Recommended. Each Worker instance keeps its own in-memory rate-limit counters. |

Leave `CONTENT_PREVIEW` unset. Rebuild after changing any variable.

**Custom domain:** Worker → Settings → Domains & Routes → Add → Custom Domain → `mambytech.com`, and `www.mambytech.com` if you want it. Cloudflare creates the DNS records and certificate.

**Email:** add the domain in Resend and copy its DNS records into Cloudflare DNS. Once it verifies, set `CONTACT_FROM_EMAIL` on that domain.

**Local check before pushing:** `npm run cf:preview` serves the Cloudflare build at http://localhost:8787. Runtime variables for it go in `.dev.vars` (git-ignored, same format as `.env`). Build-time variables still come from `.env.local`.

An optional private preview deployment can set `CONTENT_PREVIEW=true` for reviewing drafts. It is automatically `noindex`.

Security headers (`nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`) are set in `next.config.ts`.
