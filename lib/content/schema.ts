import { z } from "zod";
import { containsOwnerInput, listOwnerInput } from "./owner-input";

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

/** Honest, owner-reported project progress. */
export const projectStatuses = {
  unconfirmed: "Status not yet confirmed",
  planned: "Planned",
  "in-progress": "In progress",
  completed: "Completed",
  maintained: "Actively maintained",
  archived: "Archived",
} as const;

export const projectLinkKinds = ["repository", "live", "documentation", "other"] as const;

export const projectSchema = z
  .object({
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase-words-with-hyphens"),
    title: text,
    summary: text.max(240, "Keep summaries under 240 characters for cards and metadata"),
    /** One or two sentences: the problem, shown in project lists. */
    problemSummary: text.max(220, "Keep the problem summary under 220 characters"),
    /** One or two sentences: what Ibrahima personally did, shown in project lists. */
    contributionSummary: text.max(220, "Keep the contribution summary under 220 characters"),
    category: z.enum(projectCategories),
    technologies: z.array(text).min(1),
    status: z.enum(Object.keys(projectStatuses) as [keyof typeof projectStatuses]),
    /** "draft" is never published in production. Change to "published" once approved. */
    publication: z.enum(["draft", "published"]),
    featured: z.boolean().default(false),
    /** Optional free text, e.g. "Spring 2026". Leave out rather than guess. */
    timeframe: z.string().optional(),
    /** Things the owner still has to confirm that can't be marked inline (e.g. category). */
    ownerChecklist: z.array(text).default([]),
    caseStudy: z.object({
      problem: text,
      role: text,
      architecture: z.object({ summary: text, diagram: mediaSchema.optional() }),
      implementation: z.array(text).min(1),
      tradeoffs: z.array(z.object({ decision: text, rationale: text })).min(1),
      verification: z.array(text).min(1),
      outcomes: z.array(text).min(1),
      lessons: z.array(text).min(1),
    }),
    links: z
      .array(z.object({ label: text, href: httpsUrl, kind: z.enum(projectLinkKinds) }))
      .default([]),
    media: z.array(mediaSchema).default([]),
    /** Optional image for project lists and the case-study header. Falls back to the architecture diagram, then an illustration. */
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
    if (project.ownerChecklist.length > 0) {
      ctx.addIssue({
        code: "custom",
        path: ["ownerChecklist"],
        message: "Resolve and remove every ownerChecklist item before publishing.",
      });
    }
    if (project.status === "unconfirmed") {
      ctx.addIssue({
        code: "custom",
        path: ["status"],
        message: "Published projects need a confirmed status.",
      });
    }
  });

export type ProjectInput = z.input<typeof projectSchema>;
export type Project = z.output<typeof projectSchema>;
export type ProjectCategory = (typeof projectCategories)[number];
export type ProjectStatus = keyof typeof projectStatuses;
export type Media = z.output<typeof mediaSchema>;

/* ------------------------------------------------------------------ */
/* Writing (future section)                                            */
/* ------------------------------------------------------------------ */

export const writingSchema = z
  .object({
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    title: text,
    summary: text.max(240),
    publishedOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD"),
    tags: z.array(text).default([]),
    publication: z.enum(["draft", "published"]),
    /** Paragraphs and headings, in order. */
    body: z
      .array(
        z.discriminatedUnion("type", [
          z.object({ type: z.literal("heading"), text }),
          z.object({ type: z.literal("paragraph"), text }),
          z.object({ type: z.literal("list"), items: z.array(text).min(1) }),
          z.object({ type: z.literal("code"), language: z.string().optional(), code: text }),
        ]),
      )
      .min(1),
  })
  .refine(
    (post) => post.publication !== "published" || !containsOwnerInput(post),
    "Published writing cannot contain owner-input markers.",
  );

export type WritingInput = z.input<typeof writingSchema>;
export type Writing = z.output<typeof writingSchema>;

/* ------------------------------------------------------------------ */
/* Profile                                                             */
/* ------------------------------------------------------------------ */

const socialLinkSchema = z.object({ label: text, href: httpsUrl });

export const profileSchema = z.object({
  name: text,
  brand: text,
  tagline: text,
  focusAreas: z.array(text).min(1),
  introduction: text,
  /** Optional portrait for the About page. Leave undefined until you add a photo to /public. */
  portrait: mediaSchema.optional(),
  /** Optional public links. Leave undefined until confirmed; unset links are hidden. */
  links: z.object({
    github: socialLinkSchema.optional(),
    linkedin: socialLinkSchema.optional(),
  }),
  skillGroups: z
    .array(
      z.object({
        area: text,
        description: text,
        items: z.array(z.object({ name: text, confirmed: z.boolean() })),
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
