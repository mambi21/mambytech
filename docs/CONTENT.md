# Editing content

All content lives in typed TypeScript files under `content/`. Every file is validated when the site builds, so a mistake fails the build with a clear message instead of producing a broken page. No database or CMS is involved.

Run this at any time to validate content and list anything still waiting on your input:

```bash
npm run content:check
```

To see drafts and unconfirmed content while you edit:

```bash
npm run dev:preview      # http://localhost:3000, with a "Preview mode" banner
```

## The `needs(…)` marker

Any text can contain `needs("what is missing")`. In preview it appears as a highlighted placeholder. In production, a published project can't contain one (the build fails), and an About section that contains one is hidden. Replace each marker with your own words; never leave a guess in place of a fact.

## Profile: `content/profile.ts`

| Field | What it controls |
| --- | --- |
| `name`, `brand`, `role` | Header, home page, About page, footer, metadata |
| `headline` | The home page's opening statement |
| `introduction` | The paragraph under the headline |
| `links.linkedin` | The Contact page button and the footer link. Must be a direct `https://www.linkedin.com/in/…` profile URL (checked at build time) |
| `links.github` | Optional. Hidden until set |
| `portrait` | Optional photo on the About page. Hidden until set |
| `capabilities` | The technical capabilities summary on the home page: `area`, `summary`, and `tools`. Tools with `confirmed: false` are hidden in production, and an area with no confirmed tools is hidden entirely |

## About page: `content/about.ts`

Sections render in order, each with a `heading`, `paragraphs`, and an optional bulleted `list`. Keep it in your own voice and to facts you'd stand behind in an interview.

## Projects: `content/projects/`

There is one file per project, and `content/projects/index.ts` sets the display order. Every project uses the same layout: context label, title, summary, figure or screenshot, your contribution, and technologies.

| Field | Notes |
| --- | --- |
| `slug` | lowercase-with-hyphens; also the anchor on `/projects` (e.g. `/projects#glomaf`) |
| `title`, `summary` | `summary` is at most 240 characters |
| `context` | The label above the title, e.g. "Professional Cloud Infrastructure Engineering" |
| `contribution` | What you personally did |
| `technologies` | Shown as a list under the figure |
| `publication` | `"published"` shows it; `"draft"` hides it in production |
| `featured` | `true` also shows it on the home page |
| `figure` | A diagram drawn in code: `"aws-three-tier"`, `"linux-operations"`, `"cicd-pipeline"` or `"glomaf-platform"`. Only use one that matches the real system |
| `cover` / `media` | Real screenshots. A `cover` replaces the figure. Put images in `public/projects/<slug>/`, with real `width` and `height`, and check them for secrets, account IDs, IP addresses and hostnames first |
| `links` | `{ label, href, kind }` where `kind` is `repository`, `live`, `documentation` or `other`. Only public links |

**To add a project:** copy an existing file, change `slug`, then import it in `index.ts`.

## Diagrams: `components/figures/`

Each figure has its own file (`aws-three-tier.tsx`, `cicd-pipeline.tsx`, `linux-operations.tsx`, `glomaf-platform.tsx`) with a wide drawing, a compact drawing for phones, and a full-size view readers can open and pan. Shared drawing pieces live in `primitives.tsx`; the frame, caption and optional "steps" list live in `plate.tsx`.

The diagrams use the official AWS Architecture Icons (AWS permits them in architecture diagrams), stored in `public/aws-icons/` from the 07/31/2026 asset package; download newer ones from https://aws.amazon.com/architecture/icons/ when you update a figure. Tool logos come from Simple Icons 16.32.0 (CC0), stored in `public/tool-icons/` with the licence.

## Logo and brand assets

The official artwork lives in `public/brand/`:

- `mambytech-logo.png`: full logo (dark green). Use it on light backgrounds.
- `mambytech-mark.png`: square mark.

The site also uses `app/icon.png` and `app/apple-icon.png`, generated from these. If you replace the originals, regenerate them:

```bash
npm run brand:assets
```

## Privacy page

`app/privacy/page.tsx` describes what the site collects (nothing beyond standard hosting logs) and names the host from `HOSTING_PROVIDER_NAME`. If you add any service, such as analytics or a form, update that page and `LAST_UPDATED` in the same change.
