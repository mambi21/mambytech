import type { Metadata } from "next";
import { ArrowLink, ButtonLink, Container } from "@/components/ui";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you were looking for doesn't exist.",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <Container className="py-20 sm:py-28">
      <p className="type-label">Error 404</p>
      <h1 className="type-display mt-3">Page not found</h1>
      <p className="type-lead measure mt-5">
        The page you were looking for doesn&apos;t exist or may have moved. If you followed a link to a project, it may
        not be published yet.
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
        <ButtonLink href="/">Go to the home page</ButtonLink>
        <ArrowLink href="/projects">Browse projects</ArrowLink>
      </div>
      <p className="mt-10 text-[0.9375rem] text-ink-muted">
        Think something is broken?{" "}
        <ArrowLink href="/contact" className="font-medium">
          Let me know
        </ArrowLink>
      </p>
    </Container>
  );
}
