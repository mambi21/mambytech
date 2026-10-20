"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * "View full size" control for a diagram. Opens a modal dialog with the wide
 * drawing at a readable size; on small screens it can be panned. The drawing
 * is only rendered while the dialog is open, so it never duplicates the page's
 * copy. Escape, the Close button, or a click on the backdrop closes it, and
 * focus returns to the trigger.
 */
export function FullSizeViewer({ label, children }: { label: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
        className="type-label mt-3 inline-flex min-h-11 items-center gap-1.5 border border-rule bg-paper px-3 !text-ink transition-colors hover:border-ink md:absolute md:top-3 md:right-3 md:mt-0 md:min-h-9 md:px-2.5"
      >
        View full size
        <svg aria-hidden="true" viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M9.5 2.5h4v4M13.5 2.5 8.5 7.5M6.5 13.5h-4v-4M2.5 13.5l5-5" />
        </svg>
      </button>
      <dialog
        ref={dialogRef}
        aria-label={`${label} (full size)`}
        onClose={() => {
          setOpen(false);
          triggerRef.current?.focus();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) setOpen(false);
        }}
        className="m-auto h-[min(92dvh,60rem)] w-[min(96vw,90rem)] max-w-none overflow-hidden border border-ink bg-paper p-0 text-ink backdrop:bg-ink/60"
      >
        {open ? (
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between gap-4 border-b border-rule px-4 py-2">
              <p className="type-label">Drag or scroll to pan</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="type-label inline-flex min-h-11 items-center border border-ink px-3 !text-ink hover:bg-ink hover:!text-paper"
              >
                Close
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4" tabIndex={0} role="region" aria-label="Diagram, scrollable">
              <div className="min-w-[68rem]">{children}</div>
            </div>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
