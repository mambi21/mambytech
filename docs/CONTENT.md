# Editing content

All content lives in typed TypeScript files under `content/`. Every file is validated when the site builds, so a mistake fails the build with a clear message instead of producing a broken page. No database or CMS is involved.

Run this at any time to validate content and list what still needs your input:

```bash
npm run content:check
```

To see drafts and unconfirmed content while you edit:

```bash
npm run dev:preview      # http://localhost:3000, with a "Preview mode" banner
```

## The `needs(…)` marker

Any text can contain `needs("what is missing")`. In preview it appears as a yellow **Needs owner input** callout. In production:

- A **project** with a marker can't be published (the build fails).
- An **About section** with a marker is hidden.

Replace each marker with your own words. Never leave a guess in place of a fact.

## Biography and identity: `content/profile.ts`

| Field | What it controls |
| --- | --- |
| `name`, `brand`, `tagline` | Header, hero, footer, metadata |
| `focusAreas` | The "Cloud Infrastructure • Linux • …" line |
| `introduction` | The paragraph under the hero |
| `links.github`, `links.linkedin` | Optional. Hidden until set |
| `portrait` | Optional photo on the About page. Hidden until set |
| `skillGroups` | Home page skills. Items with `confirmed: false` are hidden in production |

Adding a link:

```ts
links: {
  github: { label: "GitHub", href: "https://github.com/your-username" },
  linkedin: undefined, // still hidden
},
```

Links must use `https://`. To add another kind of link (for example Mastodon), add it to `profileSchema.links` in `lib/content/schema.ts` as well.

## About page: `content/about.ts`

The `introduction` section opens the page under "Hi, I'm Ibrahima." The other sections follow in order, each with a `heading`, `paragraphs`, and an optional bulleted `list`. Remove a section's `needs(…)` marker to publish it, or delete the section entirely.

## Projects: `content/projects/`

There is one file per project, and `content/projects/index.ts` sets the display order.

**To publish a draft:**

1. Replace every `needs(…)` with real content.
2. Resolve and delete each `ownerChecklist` item.
3. Set `status` honestly to `planned`, `in-progress`, `completed`, `maintained` or `archived`.
4. Set `publication: "published"`.
5. Run `npm run content:check`, then `npm run build`.

**To add a project:** copy an existing file, change `slug` (lowercase-with-hyphens; it becomes `/projects/<slug>`), then import it in `index.ts`.

**Fields:**

- `problemSummary` and `contributionSummary`: one or two sentences each (at most 220 characters). Project lists show them as "Problem" and "My contribution", so state the problem and what *you* did plainly.
- `cover`: an optional image for project lists and the case-study header. If it's missing, the architecture diagram is used, then the first `media` image, then a simple category illustration.
- `category`: one of `Cloud Infrastructure`, `Linux`, `DevOps`, `Software Projects`.
- `featured: true` shows the project on the home page.
- `timeframe` is optional free text, such as `"Spring 2026"`.
- `caseStudy` holds `problem`, `role`, `architecture.summary`, `implementation` (steps), `tradeoffs` (decision and rationale), `verification`, `outcomes`, `lessons`.
- `links`: `{ label, href, kind }`, where `kind` is `repository`, `live`, `documentation` or `other`. Only add links that are public.
- `media` and `architecture.diagram`: put images in `public/projects/<slug>/` and reference them like this:

```ts
{ src: "/projects/aws-infrastructure/diagram.png", alt: "Describe what the image shows", width: 1600, height: 900 }
```

`width` and `height` must be the image's real pixel size, so the layout reserves space and doesn't shift. Images are optimised automatically (AVIF/WebP). Check screenshots for secrets, account IDs, IP addresses and hostnames before adding them.

## Writing (future section)

The schema (`writingSchema` in `lib/content/schema.ts`), the registry (`content/writing/index.ts`) and the loader (`getWriting()`) already exist. There is no route or navigation entry yet, so no empty page is shown. When the first post is ready:

1. Add a post object to `content/writing/index.ts`. Its body is a list of `heading`, `paragraph`, `list` and `code` blocks.
2. Create `app/writing/page.tsx` and `app/writing/[slug]/page.tsx`, modelled on the project pages and using `getWriting()`.
3. Add `{ href: "/writing", label: "Writing" }` to `lib/navigation.ts`, and add the URLs to `app/sitemap.ts`.

## Logo and brand assets

The official artwork lives in `public/brand/`:

- `mambytech-logo.png`: full logo (dark green). Use it on light backgrounds.
- `mambytech-mark.png`: square mark.

The site uses versions generated from these: `mambytech-logo-on-dark.png` (the wordmark recoloured light for the dark theme, with the tile unchanged), plus `app/icon.png` and `app/apple-icon.png`. If you replace the originals, regenerate them:

```bash
npm run brand:assets
```

## Privacy page

`app/privacy/page.tsx` is generated from the real configuration (contact provider, rate-limit store, `HOSTING_PROVIDER_NAME`). If you add any service, such as analytics, update that page and `LAST_UPDATED` in the same change.
