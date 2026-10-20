import { z } from "zod";
import { listOwnerInput } from "./owner-input";

/* ------------------------------------------------------------------ */
/* Shared                                                              */
/* ------------------------------------------------------------------ */

const text = z.string().trim().min(1);

/** External links must use HTTPS. Missing links are simply omitted. */
const httpsUrl = z
  .string()
  .url()
  .refine((value) => value.startsWith("https://"), "Links must use https://");

/** Images live in /public so they are optimised by next/image. */
export const mediaSchema = z.object({
  src: z.string().startsWith("/", "Use a path inside /public, e.g. /projects/aws/diagram.png"),
  alt: text,
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  caption: z.string().optional(),
});

/* ------------------------------------------------------------------ */
/* Projects                                                            */
/* ------------------------------------------------------------------ */

export const projectCategories = [
  "Cloud Infrastructure",
  "Linux",
  "DevOps",
  "Software Projects",
] as const;

export const projectLinkKinds = ["repository", "live", "documentation", "other"] as const;

/** Technical figures drawn in code (see components/figures.tsx). Use one only if it matches the real system. */
export const projectFigures = ["aws-three-tier", "linux-operations", "cicd-pipeline", "glomaf-platform"] as const;

/** Published entries appear directly on the Projects page; drafts remain private. */
export const publicationStates = ["draft", "published"] as const;

export const projectSchema = z
  .object({
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase-words-with-hyphens"),
    title: text,
    summary: text.max(240, "Keep summaries under 240 characters for cards and metadata"),
    /** Owner-confirmed setting for the work, without implying unverified results. */
    context: text,
    /** A concise account of Ibrahima's actual contribution. */
    contribution: text,
    category: z.enum(projectCategories),
    technologies: z.array(text).min(1),
    /** See `publicationStates`. Drafts are never shown in production. */
    publication: z.enum(publicationStates),
    featured: z.boolean().default(false),
    /** A technical figure drawn in code, used when there's no cover image. */
    figure: z.enum(projectFigures).optional(),
    links: z
      .array(z.object({ label: text, href: httpsUrl, kind: z.enum(projectLinkKinds) }))
      .default([]),
    media: z.array(mediaSchema).default([]),
    /** Optional genuine project screenshot, with descriptive alternative text. */
    cover: mediaSchema.optional(),
  })
  .superRefine((project, ctx) => {
    if (project.publication !== "published") return;
    const missing = listOwnerInput(project);
    if (missing.length > 0) {
      ctx.addIssue({
        code: "custom",
        message: `Published projects cannot contain owner-input markers. Still needed: ${missing.join(" | ")}`,
      });
    }
  });

export type ProjectInput = z.input<typeof projectSchema>;
export type Project = z.output<typeof projectSchema>;
export type ProjectCategory = (typeof projectCategories)[number];
export type Media = z.output<typeof mediaSchema>;

/* ------------------------------------------------------------------ */
/* Profile                                                             */
/* ------------------------------------------------------------------ */

const socialLinkSchema = z.object({ label: text, href: httpsUrl });

/** Accept a direct personal LinkedIn profile, never a guessed or unrelated destination. */
export const linkedinProfileUrlSchema = httpsUrl.refine((value) => {
  const url = new URL(value);
  return (
    ["linkedin.com", "www.linkedin.com"].includes(url.hostname) &&
    !url.username &&
    !url.password &&
    !url.port &&
    /^\/in\/[^/]+\/?$/.test(url.pathname)
  );
}, "Use a direct HTTPS LinkedIn profile URL: https://www.linkedin.com/in/your-profile/");

export const profileSchema = z.object({
  name: text,
  brand: text,
  /** Professional title, e.g. "Cloud Infrastructure & Linux Engineer". */
  role: text,
  /** The home page's opening statement. */
  headline: text,
  introduction: text,
  /** Optional portrait for the About page. Leave undefined until you add a photo to /public. */
  portrait: mediaSchema.optional(),
  /** Optional public links. Leave undefined until confirmed; unset links are hidden. */
  links: z.object({
    github: socialLinkSchema.optional(),
    linkedin: socialLinkSchema.extend({ href: linkedinProfileUrlSchema }).optional(),
  }),
  /**
   * The capabilities summary: what you do in each area and the tools. Tools with `confirmed: false` are hidden in
   * production; an area with no confirmed tools is hidden entirely.
   */
  capabilities: z
    .array(
      z.object({
        area: text,
        summary: text,
        tools: z.array(z.object({ name: text, confirmed: z.boolean() })),
      }),
    )
    .min(1),
});

export type ProfileInput = z.input<typeof profileSchema>;

export type Profile = z.output<typeof profileSchema>;

export const aboutSchema = z.object({
  /** Each section is hidden in production while it still contains owner-input markers. */
  sections: z
    .array(
      z.object({
        id: z.string().regex(/^[a-z0-9-]+$/),
        heading: text,
        paragraphs: z.array(text).default([]),
        list: z.array(text).default([]),
      }),
    )
    .min(1),
});

export type AboutInput = z.input<typeof aboutSchema>;
export type About = z.output<typeof aboutSchema>;
