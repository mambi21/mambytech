import type { Certification } from "@/lib/content/schema";
import { formatMonth } from "@/lib/format";
import { BadgeIcon, ExternalIcon } from "./icons";

/** Certification cards. Only the details that have been provided are shown. */
export function CertificationCards({ items }: { items: Certification[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <li key={item.name} className="reveal flex items-start gap-4 rounded-2xl border border-rule bg-white p-5 shadow-[var(--shadow-card)]">
          <span className="flex size-14 shrink-0 flex-col items-center justify-center rounded-xl bg-brand text-paper">
            <BadgeIcon className="size-5" />
            <span className="mt-0.5 text-[0.625rem] font-bold tracking-wide">{item.abbreviation}</span>
          </span>
          <div className="min-w-0">
            <h3 className="font-bold leading-snug tracking-[-0.01em]">{item.name}</h3>
            <p className="mt-0.5 text-sm text-ink-muted">
              {item.issuer}
              {item.issued ? (
                <>
                  {" · "}
                  <time dateTime={item.issued}>{formatMonth(item.issued)}</time>
                </>
              ) : null}
            </p>
            {item.credentialId ? <p className="mt-1 font-mono text-xs text-ink-subtle">ID {item.credentialId}</p> : null}
            {item.verifyUrl ? (
              <a
                href={item.verifyUrl}
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline hover:underline-offset-4"
              >
                Verify
                <ExternalIcon className="size-3.5" />
                <span className="sr-only"> {item.name} credential</span>
              </a>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  );
}
