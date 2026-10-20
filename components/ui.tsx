import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

/** Small presentational building blocks shared across pages. */

export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/** Page-width frame. Sections choose their own inner grid and measure. */
export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cx("mx-auto w-full max-w-[88rem] px-5 sm:px-8 lg:px-12", className)}>{children}</div>;
}

/** Interior page opening: mono label, large title, optional lead, on the editorial grid. */
export function PageHeader({ label, title, children }: { label: string; title: ReactNode; children?: ReactNode }) {
  return (
    <Container className="pt-14 pb-14 sm:pt-20 sm:pb-20">
      <div className="grid-editorial">
        <p className="type-label col-span-12 md:col-span-3 md:pt-4">{label}</p>
        <div className="col-span-12 mt-5 md:col-span-9 md:mt-0">
          <h1 className="type-display max-w-[16ch] text-balance">{title}</h1>
          {children ? <div className="type-lead measure mt-6">{children}</div> : null}
        </div>
      </div>
    </Container>
  );
}

const buttonBase =
  "group inline-flex min-h-12 items-center justify-center gap-3 px-6 py-3 text-[0.9375rem] font-semibold tracking-[-0.005em] transition-colors duration-200";

const buttonVariants = {
  primary: "bg-brand text-paper hover:bg-brand-hover",
  secondary: "border border-ink text-ink hover:bg-ink hover:text-paper",
} as const;

export function ButtonLink({
  variant = "primary",
  className,
  children,
  ...props
}: ComponentProps<typeof Link> & { variant?: keyof typeof buttonVariants }) {
  return (
    <Link className={cx(buttonBase, buttonVariants[variant], className)} {...props}>
      {children}
    </Link>
  );
}

export function buttonClasses(variant: keyof typeof buttonVariants = "primary", className?: string) {
  return cx(buttonBase, buttonVariants[variant], className);
}

/** Text link with a trailing arrow; the underline draws in on hover. */
export function ArrowLink({ className, children, ...props }: ComponentProps<typeof Link>) {
  return (
    <Link className={cx("group inline-flex items-center gap-2 font-semibold text-brand", className)} {...props}>
      <span className="link-draw pb-0.5">{children}</span>
      <ArrowIcon className="transition-transform duration-300 ease-[var(--ease-out-quint)] group-hover:translate-x-1" />
    </Link>
  );
}

export function ArrowIcon({ className, direction = "right" }: { className?: string; direction?: "right" | "down" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className={cx("size-4 shrink-0", direction === "down" && "rotate-90", className)}>
      <path d="M3.5 10h12m0 0-5-5m5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
    </svg>
  );
}
