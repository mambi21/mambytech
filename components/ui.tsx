import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

/** Small presentational building blocks shared across pages. */

export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cx("mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8", className)}>{children}</div>;
}

/** Interior page introduction: small label, serif title, optional lead. */
export function PageHeader({ label, title, children }: { label: string; title: ReactNode; children?: ReactNode }) {
  return (
    <Container className="pt-14 pb-10 sm:pt-20 sm:pb-14">
      <p className="type-label">{label}</p>
      <h1 className="type-display mt-3 max-w-3xl text-balance">{title}</h1>
      {children ? <div className="type-lead measure mt-5">{children}</div> : null}
    </Container>
  );
}

/** Section heading with a hairline rule above it. */
export function SectionHeading({ id, title, children }: { id: string; title: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 border-t border-ink pt-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8">
      <h2 id={id} className="type-heading">
        {title}
      </h2>
      {children ? <div className="text-[0.9375rem] text-ink-muted">{children}</div> : null}
    </div>
  );
}

const buttonBase =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-5 py-2.5 text-[0.9375rem] font-semibold transition-colors duration-150";

const buttonVariants = {
  primary: "bg-brand text-paper hover:bg-brand-hover",
  secondary: "border border-field bg-white text-ink hover:border-ink",
} as const;

export function ButtonLink({
  variant = "primary",
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: keyof typeof buttonVariants }) {
  return <Link className={cx(buttonBase, buttonVariants[variant], className)} {...props} />;
}

export function buttonClasses(variant: keyof typeof buttonVariants = "primary", className?: string) {
  return cx(buttonBase, buttonVariants[variant], className);
}

/** Quiet text link with a trailing arrow, used for secondary actions. */
export function ArrowLink({ className, children, ...props }: ComponentProps<typeof Link>) {
  return (
    <Link
      className={cx(
        "group inline-flex items-center gap-1.5 font-semibold text-brand underline decoration-brand/30 decoration-1 underline-offset-4 transition-colors hover:decoration-brand",
        className,
      )}
      {...props}
    >
      {children}
      <ArrowIcon className="transition-transform duration-150 group-hover:translate-x-0.5" />
    </Link>
  );
}

export function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className={cx("size-4 shrink-0", className)}>
      <path d="M4 10h11m0 0-4.5-4.5M15 10l-4.5 4.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
