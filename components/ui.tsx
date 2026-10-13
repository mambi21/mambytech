import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

/** Small presentational building blocks shared across pages. */

export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cx("mx-auto w-full max-w-[76rem] px-4 sm:px-6 lg:px-8", className)}>{children}</div>;
}

/** Small uppercase label in the brand colour, used above headings. */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cx("type-label text-brand", className)}>{children}</p>;
}

/** Interior page introduction: eyebrow, bold title, optional lead, on a faint grid. */
export function PageHeader({ label, title, children }: { label: string; title: ReactNode; children?: ReactNode }) {
  return (
    <div className="relative overflow-hidden border-b border-rule">
      <div aria-hidden="true" className="bg-grid-light absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <Container className="relative pt-14 pb-12 sm:pt-20 sm:pb-16">
        <Eyebrow>{label}</Eyebrow>
        <h1 className="type-display mt-3 max-w-3xl text-balance">{title}</h1>
        {children ? <div className="type-lead measure mt-5">{children}</div> : null}
      </Container>
    </div>
  );
}

/** Section heading: bold title on the left, an optional action (e.g. "View all") on the right. */
export function SectionHeading({
  id,
  title,
  eyebrow,
  children,
}: {
  id: string;
  title: string;
  eyebrow?: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
      <div>
        {eyebrow ? <Eyebrow className="mb-2">{eyebrow}</Eyebrow> : null}
        <h2 id={id} className="type-title">
          {title}
        </h2>
      </div>
      {children ? <div className="text-[0.9375rem] text-ink-muted">{children}</div> : null}
    </div>
  );
}

/** Rounded surface used for cards across the site. */
export function Card({ className, children, as: Tag = "div" }: { className?: string; children: ReactNode; as?: "div" | "li" | "article" }) {
  return <Tag className={cx("rounded-2xl border border-rule bg-white shadow-[var(--shadow-card)]", className)}>{children}</Tag>;
}

/** Compact technology chip. */
export function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cx("inline-flex items-center rounded-md border border-rule bg-paper px-2 py-0.5 font-mono text-xs leading-5 text-ink-muted", className)}>
      {children}
    </span>
  );
}

const buttonBase =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-[0.9375rem] font-semibold transition-[background-color,border-color,box-shadow,transform] duration-150 active:translate-y-px";

const buttonVariants = {
  primary: "bg-brand text-paper shadow-[0_6px_16px_-8px_rgb(14_59_49/0.6)] hover:bg-brand-hover hover:shadow-[0_10px_22px_-10px_rgb(14_59_49/0.7)]",
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
