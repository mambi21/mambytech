import { z } from "zod";

/** Limits are enforced on the server; the form mirrors them for guidance. */
export const CONTACT_LIMITS = {
  name: 100,
  email: 254,
  messageMin: 10,
  messageMax: 5000,
  maxLinks: 3,
  /** Submissions faster than this after the form loaded are treated as automated. */
  minFillMs: 3000,
} as const;

const noLineBreaks = (value: string) => !/[\r\n]/.test(value);
const countLinks = (value: string) => (value.match(/https?:\/\/|www\./gi) ?? []).length;

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Enter your name.")
    .max(CONTACT_LIMITS.name, `Use ${CONTACT_LIMITS.name} characters or fewer for your name.`)
    .refine(noLineBreaks, "Your name can't contain line breaks."),
  email: z
    .string()
    .trim()
    .min(1, "Enter your email address so I can reply.")
    .max(CONTACT_LIMITS.email, "That email address is too long.")
    .pipe(z.email("Enter a valid email address, like name@example.com.")),
  message: z
    .string()
    .trim()
    .min(1, "Enter a message.")
    .min(CONTACT_LIMITS.messageMin, `Your message needs at least ${CONTACT_LIMITS.messageMin} characters.`)
    .max(
      CONTACT_LIMITS.messageMax,
      `Keep your message under ${CONTACT_LIMITS.messageMax.toLocaleString("en-US")} characters.`,
    )
    .refine(
      (value) => countLinks(value) <= CONTACT_LIMITS.maxLinks,
      `Please include no more than ${CONTACT_LIMITS.maxLinks} links.`,
    ),
});

export type ContactFields = z.infer<typeof contactSchema>;
export type ContactFieldName = keyof ContactFields;

export type ContactState =
  | { status: "idle" }
  | { status: "success" }
  | {
      status: "invalid" | "error" | "unavailable" | "rate-limited" | "rejected";
      message: string;
      fieldErrors?: Partial<Record<ContactFieldName, string>>;
      values?: Partial<ContactFields>;
    };

export const initialContactState: ContactState = { status: "idle" };

/** Validates raw form values, returning parsed fields or per-field errors. */
export function validateContact(
  raw: Record<ContactFieldName, string>,
): { ok: true; fields: ContactFields } | { ok: false; fieldErrors: Partial<Record<ContactFieldName, string>> } {
  const result = contactSchema.safeParse(raw);
  if (result.success) return { ok: true, fields: result.data };
  const fieldErrors: Partial<Record<ContactFieldName, string>> = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as ContactFieldName;
    fieldErrors[field] ??= issue.message;
  }
  return { ok: false, fieldErrors };
}

export type SpamCheck = { honeypot: string; startedAt: string };

/** Returns a reason when the submission looks automated, otherwise null. */
export function checkSpam({ honeypot, startedAt }: SpamCheck, now = Date.now()): "honeypot" | "too-fast" | null {
  if (honeypot.trim() !== "") return "honeypot";
  // startedAt is set by the browser once the form is interactive. Without
  // JavaScript it is empty, and the rate limiter still applies.
  if (startedAt !== "") {
    const started = Number(startedAt);
    if (!Number.isFinite(started) || started > now + 60_000) return "too-fast";
    if (now - started < CONTACT_LIMITS.minFillMs) return "too-fast";
  }
  return null;
}
