import { splitOwnerInput } from "@/lib/content/owner-input";

/**
 * Renders content text, showing any `needs(…)` markers as clearly labelled
 * owner-input callouts. Markers only reach the page in preview mode.
 */
export function OwnerText({ value }: { value: string }) {
  return (
    <>
      {splitOwnerInput(value).map((segment, index) =>
        segment.type === "text" ? (
          <span key={index}>{segment.value}</span>
        ) : (
          <OwnerInputMark key={index}>{segment.value}</OwnerInputMark>
        ),
      )}
    </>
  );
}

export function OwnerInputMark({ children }: { children: React.ReactNode }) {
  return (
    <mark className="rounded-sm border border-dashed border-owner-line bg-owner-bg px-1.5 py-0.5 text-owner [box-decoration-break:clone]">
      <strong className="text-[0.75em] font-semibold uppercase tracking-wide">Needs owner input: </strong>
      {children}
    </mark>
  );
}

/** Dashed placeholder block shown in preview when something is still needed. */
export function OwnerPlaceholder({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-sm border border-dashed border-owner-line bg-owner-bg p-5 text-[0.9375rem] text-owner ${className ?? ""}`}>
      <strong className="block text-xs font-semibold uppercase tracking-wide">Needs owner input</strong>
      <span className="mt-1 block">{children}</span>
    </div>
  );
}
