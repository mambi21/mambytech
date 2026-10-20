import type { ReactNode } from "react";
import { cx } from "../ui";
import { FullSizeViewer } from "./viewer";

/**
 * A figure plate: hairline frame with crop marks, a numbered caption, and an
 * optional list of steps that stays collapsed until a reader asks for it.
 */
export function Plate({
  number,
  caption,
  steps,
  tone = "light",
  className,
  children,
}: {
  number: string;
  caption: ReactNode;
  /** Optional numbered walkthrough, shown in a "Steps" disclosure under the caption. */
  steps?: { title: string; items: string[] };
  tone?: "light" | "dark";
  className?: string;
  children: ReactNode;
}) {
  const dark = tone === "dark";
  const mark = cx("absolute size-3", dark ? "border-term-dim" : "border-ink");
  return (
    <figure className={className}>
      <div className={cx("relative border p-3 sm:p-5", dark ? "border-term-line bg-term" : "border-rule bg-paper-2/70")}>
        <span aria-hidden="true" className={cx(mark, "-top-px -left-px border-t border-l")} />
        <span aria-hidden="true" className={cx(mark, "-top-px -right-px border-t border-r")} />
        <span aria-hidden="true" className={cx(mark, "-bottom-px -left-px border-b border-l")} />
        <span aria-hidden="true" className={cx(mark, "-right-px -bottom-px border-r border-b")} />
        {children}
        {/* On the night ground the caption stays inside the frame, so it reads on any page background. */}
        {dark ? <Caption number={number} caption={caption} dark className="-mx-3 -mb-3 mt-4 border-t border-term-line px-3 py-3 sm:-mx-5 sm:-mb-5 sm:px-5" /> : null}
      </div>
      {dark ? null : <Caption number={number} caption={caption} className="mt-3" />}
      {steps ? (
        <details className="group mt-3 border-t border-rule pt-3">
          <summary className="type-label inline-flex min-h-11 cursor-pointer list-none items-center gap-2 text-brand [&::-webkit-details-marker]:hidden">
            <span aria-hidden="true" className="inline-block transition-transform group-open:rotate-90">
              ›
            </span>
            {steps.title}
          </summary>
          <ol className="mt-2 grid gap-x-10 gap-y-2 text-[0.9375rem] text-ink-muted sm:grid-cols-2">
            {steps.items.map((item, index) => (
              <li key={item} className="grid grid-cols-[2rem_1fr]">
                <span aria-hidden="true" className="type-mono text-brand">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </details>
      ) : null}
    </figure>
  );
}

function Caption({ number, caption, dark, className }: { number: string; caption: ReactNode; dark?: boolean; className?: string }) {
  return (
    <figcaption className={cx("type-mono flex gap-3 text-[0.8125rem]", dark ? "text-term-dim" : "text-ink-muted", className)}>
      <span className={cx("shrink-0", dark ? "text-term-prompt" : "text-brand")}>Fig. {number}</span>
      <span>{caption}</span>
    </figcaption>
  );
}

/**
 * Two drawings of one figure: a wide one from the md breakpoint and a compact
 * one below it, plus a full-size view of the wide drawing that can be panned
 * on small screens.
 */
export function Responsive({ label, wide, compact, full }: { label: string; wide: ReactNode; compact: ReactNode; full: ReactNode }) {
  return (
    <>
      <div className="hidden md:block" role="img" aria-label={label}>
        {wide}
      </div>
      <div className="md:hidden" role="img" aria-label={label}>
        {compact}
      </div>
      <FullSizeViewer label={label}>{full}</FullSizeViewer>
    </>
  );
}
