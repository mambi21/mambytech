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

/** Labelled architecture diagrams available as code (see components/architecture-diagram.tsx). */
export const architectureDrawings = ["aws-three-tier"] as const;

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
      architecture: z.object({
        summary: text,
        diagram: mediaSchema.optional(),
        /** A labelled diagram drawn in code, used when there's no diagram image. Pick the one that matches the real design. */
        drawing: z.enum(architectureDrawings).optional(),
      }),
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
    /** Short topic label shown on article cards, e.g. "Linux" or "AWS". */
    category: text,
    /** Required once published. Use the real publication date. */
    publishedOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD").optional(),
    tags: z.array(text).default([]),
    publication: z.enum(["draft", "published"]),
    /** Optional thumbnail. Without one, a category illustration is shown. */
    cover: mediaSchema.optional(),
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
  .superRefine((post, ctx) => {
    if (post.publication !== "published") return;
    if (containsOwnerInput(post)) {
      ctx.addIssue({ code: "custom", message: "Published writing cannot contain owner-input markers." });
    }
    if (!post.publishedOn) {
      ctx.addIssue({ code: "custom", path: ["publishedOn"], message: "Published writing needs its publication date." });
    }
  });

export type WritingInput = z.input<typeof writingSchema>;
export type Writing = z.output<typeof writingSchema>;

/* ------------------------------------------------------------------ */
/* Profile                                                             */
/* ------------------------------------------------------------------ */

const socialLinkSchema = z.object({ label: text, href: httpsUrl });

export const expertiseIcons = ["linux", "cloud", "automation", "reliability"] as const;

export const profileSchema = z.object({
  name: text,
  brand: text,
  tagline: text,
  /** Professional title shown under the name in the hero. */
  role: text,
  focusAreas: z.array(text).min(1),
  introduction: text,
  /** The four expertise cards under the hero. */
  expertise: z
    .array(
      z.object({
        title: text,
        description: text,
        icon: z.enum(expertiseIcons),
        items: z.array(text).min(1),
      }),
    )
    .min(1)
    .max(4),
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

/* ------------------------------------------------------------------ */
/* Experience and certifications                                       */
/* ------------------------------------------------------------------ */

/** "YYYY-MM", "YYYY", or (for `end`) "present". */
const monthOrYear = z.string().regex(/^\d{4}(-\d{2})?$/, "Use YYYY-MM or YYYY");

/** A role in the career timeline. Shown in production only once it has no owner-input markers. */
export const experienceSchema = z.object({
  organization: text,
  role: text,
  start: z.union([monthOrYear, text]),
  end: z.union([monthOrYear, z.literal("present"), text]),
  location: z.string().optional(),
  summary: text,
  highlights: z.array(text).default([]),
  technologies: z.array(text).default([]),
});

/** A certification. Optional fields are left out until confirmed; the card shows only what is set. */
export const certificationSchema = z.object({
  name: text,
  /** Short form shown large on the card, e.g. "RHCSA". */
  abbreviation: text,
  issuer: text,
  /** "YYYY-MM" or "YYYY". */
  issued: monthOrYear.optional(),
  credentialId: z.string().optional(),
  verifyUrl: httpsUrl.optional(),
});

export type ExperienceInput = z.input<typeof experienceSchema>;
export type Experience = z.output<typeof experienceSchema>;
export type CertificationInput = z.input<typeof certificationSchema>;
export type Certification = z.output<typeof certificationSchema>;
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
