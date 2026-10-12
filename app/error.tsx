"use client";

import { useEffect, useRef } from "react";
import { ArrowLink, Container, buttonClasses } from "@/components/ui";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => headingRef.current?.focus(), []);

  return (
    <Container className="py-20 sm:py-28">
      <p className="type-label">Something went wrong</p>
      <h1 ref={headingRef} tabIndex={-1} className="type-display mt-3 focus:outline-none">
        This page couldn&apos;t be loaded
      </h1>
      <p className="type-lead measure mt-5">
        An unexpected error occurred. Trying again usually fixes it. If it keeps happening, please come back a little
        later.
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
        <button type="button" onClick={() => reset()} className={buttonClasses("primary")}>
          Try again
        </button>
        <ArrowLink href="/">Go to the home page</ArrowLink>
      </div>
    </Container>
  );
}
