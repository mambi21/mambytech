import { ArrowLink, Container } from "./ui";

/** Closing band on each page: one sentence and the way to reach Ibrahima. */
export function ConnectSection() {
  return (
    <section aria-labelledby="connect-heading" className="border-t border-rule bg-paper-2">
      <Container className="flex flex-col justify-between gap-6 py-10 sm:flex-row sm:items-center sm:py-12">
        <div>
          <h2 id="connect-heading" className="type-heading">
            Let’s connect.
          </h2>
          <p className="mt-2 max-w-xl text-ink-muted">For engineering opportunities, collaboration, or a conversation about the work, find me on LinkedIn.</p>
        </div>
        <ArrowLink href="/contact" className="shrink-0 py-3">
          Contact
        </ArrowLink>
      </Container>
    </section>
  );
}
