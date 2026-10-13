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
| `role` | The title under your name in the hero, e.g. "Cloud Infrastructure & Linux Engineer" |
| `focusAreas` | The "Cloud Infrastructure · Linux · …" line above the hero heading |
| `introduction` | The paragraph under the hero heading |
| `expertise` | The four cards under the hero: `title`, `description`, `icon` (`linux`, `cloud`, `automation` or `reliability`) and `items` |
| `links.github`, `links.linkedin` | Optional. Hidden until set |
| `portrait` | Optional photo. Replaces the infrastructure illustration in the hero and the profile card on the About page |
| `skillGroups` | Skills on the home and About pages. Items with `confirmed: false` are hidden in production, and a group with no confirmed items is hidden entirely |

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
- `cover`: an optional image for project cards and the case-study header. If it's missing, the architecture diagram is used, then the first `media` image, then a category illustration.
- `caseStudy.architecture.drawing`: a labelled diagram drawn in code, used when there's no `diagram` image. Currently `"aws-three-tier"`. Only use it if it matches the real design.
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

## Experience: `content/experience.ts`

The career timeline, most recent first. Each entry has `organization`, `role`, `start`, `end`, `summary`, and optional `location`, `highlights` and `technologies`. Dates use `"YYYY-MM"` (or `"YYYY"`), and `end` can be `"present"`.

An entry is shown in production only once it has no `needs(…)` markers. The Experience page, its navigation link and the home-page section appear as soon as one entry is complete.

## Certifications: `content/certifications.ts`

Each certification has a `name`, a short `abbreviation` (shown on the badge) and an `issuer`. Optionally add `issued` (`"YYYY-MM"`), `credentialId` and a public `verifyUrl` (https). Cards show only what is set.

## Blog: `content/writing/index.ts`

Posts appear on `/blog`, and the latest three appear on the home page. Each post has a `slug`, `title`, `summary`, `category` (a short label such as "Linux" or "AWS"), an optional `cover` image, and a `body` made of `heading`, `paragraph`, `list` and `code` blocks. Reading time is calculated from the body.

The file holds five draft topic ideas. Drafts appear only in preview mode. To publish a post, write its body, set `publication: "published"` and set `publishedOn` to the real date (`"YYYY-MM-DD"`). The Blog page and its navigation link stay hidden until at least one post is published.

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
