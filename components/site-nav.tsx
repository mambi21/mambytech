"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { cx } from "./ui";

export type NavItem = { href: string; label: string };

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Primary navigation: inline links on wide screens, a disclosure menu on
 * small screens. The menu closes on Escape (returning focus to the toggle),
 * on outside click, and after a link is chosen.
 */
export function SiteNav({ items, cta }: { items: NavItem[]; cta?: NavItem }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!panelRef.current?.contains(target) && !toggleRef.current?.contains(target)) setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <nav aria-label="Primary" className="flex items-center gap-3">
      <ul className="hidden items-center gap-1 md:flex lg:gap-2">
        {items.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cx(
                  "relative block rounded-md px-3 py-2 text-[0.9375rem] font-medium transition-colors",
                  "after:absolute after:inset-x-3 after:-bottom-[0.6rem] after:h-0.5 after:rounded-full after:transition-colors",
                  active ? "text-brand after:bg-brand" : "text-ink-muted after:bg-transparent hover:bg-paper-2 hover:text-ink",
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
      {cta ? (
        <Link
          href={cta.href}
          className="ml-3 hidden min-h-10 items-center rounded-lg bg-brand px-4 text-[0.9375rem] font-semibold text-paper shadow-[0_6px_16px_-8px_rgb(14_59_49/0.6)] transition-colors hover:bg-brand-hover lg:inline-flex"
        >
          {cta.label}
        </Link>
      ) : null}

      <button
        ref={toggleRef}
        type="button"
        className="inline-flex size-11 items-center justify-center rounded-lg border border-field bg-white text-ink transition-colors hover:border-ink md:hidden"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
          {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>

      <div
        ref={panelRef}
        id={menuId}
        hidden={!open}
        className="absolute inset-x-0 top-full border-b border-rule bg-paper shadow-[0_12px_24px_-12px_rgb(28_33_31/0.25)] md:hidden"
      >
        <ul className="mx-auto flex max-w-[76rem] flex-col px-4 py-3 sm:px-6">
          {items.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <li key={item.href} className="border-b border-rule last:border-b-0">
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className={cx(
                    "flex min-h-12 items-center text-base font-medium",
                    active ? "text-brand" : "text-ink hover:text-brand",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
          {cta ? (
            <li className="pt-3 pb-1">
              <Link
                href={cta.href}
                onClick={() => setOpen(false)}
                className="flex min-h-12 items-center justify-center rounded-lg bg-brand text-base font-semibold text-paper hover:bg-brand-hover"
              >
                {cta.label}
              </Link>
            </li>
          ) : null}
        </ul>
      </div>
    </nav>
  );
}
