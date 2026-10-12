/**
 * Owner-input markers.
 *
 * Any content string can contain `needs("…")`. In preview mode the marker is
 * rendered as a highlighted callout so missing information is obvious. In
 * production, published content is rejected at build time if it still
 * contains a marker, and optional sections that contain one are hidden.
 */
const OPEN = "⟦NEEDS OWNER INPUT: ";
const CLOSE = "⟧";

export const OWNER_INPUT_PATTERN = /⟦NEEDS OWNER INPUT: ([^⟧]*)⟧/g;

/** Mark a piece of content that only the site owner can supply. */
export function needs(description: string): string {
  return `${OPEN}${description}${CLOSE}`;
}

/** True when any string nested anywhere inside `value` contains a marker. */
export function containsOwnerInput(value: unknown): boolean {
  return listOwnerInput(value).length > 0;
}

/** Every marker description nested inside `value`, in document order. */
export function listOwnerInput(value: unknown): string[] {
  const found: string[] = [];
  const visit = (v: unknown) => {
    if (typeof v === "string") {
      for (const match of v.matchAll(OWNER_INPUT_PATTERN)) found.push(match[1]);
    } else if (Array.isArray(v)) {
      v.forEach(visit);
    } else if (v && typeof v === "object") {
      Object.values(v).forEach(visit);
    }
  };
  visit(value);
  return found;
}

export type TextSegment = { type: "text"; value: string } | { type: "owner-input"; value: string };

/** Split a string into plain text and owner-input segments for rendering. */
export function splitOwnerInput(text: string): TextSegment[] {
  const segments: TextSegment[] = [];
  let last = 0;
  for (const match of text.matchAll(OWNER_INPUT_PATTERN)) {
    const index = match.index ?? 0;
    if (index > last) segments.push({ type: "text", value: text.slice(last, index) });
    segments.push({ type: "owner-input", value: match[1] });
    last = index + match[0].length;
  }
  if (last < text.length) segments.push({ type: "text", value: text.slice(last) });
  return segments;
}
