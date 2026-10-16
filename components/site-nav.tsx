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
 * Primary navigation: inline links on wide screens; on small screens a
 * full-height panel with large type. The panel closes on Escape (returning
 * focus to the toggle), on outside click, and after a link is chosen.
 */
export function SiteNav({ items }: { items: NavItem[] }) {
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
    <nav aria-label="Primary">
      <ul className="hidden items-center gap-9 md:flex">
        {items.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cx(
                  "relative py-2 text-[0.9375rem] font-medium transition-colors",
                  "after:absolute after:inset-x-0 after:bottom-0.5 after:h-px after:origin-left after:bg-current after:transition-transform after:duration-300 after:ease-[var(--ease-out-quint)]",
                  active ? "text-brand after:scale-x-100" : "text-ink-muted after:scale-x-0 hover:text-ink hover:after:scale-x-100",
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>

      <button
        ref={toggleRef}
        type="button"
        className="type-label inline-flex min-h-11 items-center gap-2 border border-ink px-3.5 text-ink md:hidden"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? "Close" : "Menu"}
      </button>

      <div
        ref={panelRef}
        id={menuId}
        hidden={!open}
        // Absolute, not fixed: the header's backdrop filter would make a fixed panel resolve against the header.
        className="absolute inset-x-0 top-full z-40 h-[calc(100dvh-4.5rem)] overflow-y-auto border-t border-ink bg-paper md:hidden"
      >
        <ul className="flex flex-col px-5 pt-4 pb-10 sm:px-8">
          {items.map((item, index) => {
            const active = isActive(pathname, item.href);
            return (
              <li key={item.href} className="border-b border-rule">
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className={cx(
                    "flex items-baseline gap-4 py-4 text-[2.25rem] leading-tight font-semibold tracking-[-0.03em] [font-stretch:85%]",
                    active ? "text-brand" : "text-ink",
                  )}
                >
                  <span aria-hidden="true" className="type-label w-6">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
