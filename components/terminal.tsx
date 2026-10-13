/**
 * Compact terminal summary. Real text (screen readers read it as a short
 * session); only the window chrome and blinking cursor are decorative. The
 * cursor only blinks when the visitor hasn't asked for reduced motion.
 */
export function Terminal({ handle, focus, motto }: { handle: string; focus: string[]; motto: string }) {
  const slugs = focus.map((area) => area.toLowerCase().replace(/\s+/g, "-"));
  return (
    <figure className="overflow-hidden rounded-2xl bg-term text-term-text shadow-[0_24px_48px_-20px_rgb(17_23_20/0.6)] ring-1 ring-term-line">
      <div aria-hidden="true" className="flex items-center gap-1.5 border-b border-term-line px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-[#3a4540]" />
        <span className="size-2.5 rounded-full bg-[#3a4540]" />
        <span className="size-2.5 rounded-full bg-[#3a4540]" />
        <span className="ml-3 font-mono text-xs text-term-dim">~/mambytech</span>
      </div>
      <figcaption className="sr-only">Terminal summary</figcaption>
      <pre className="px-5 py-4 font-mono text-[0.8125rem] leading-[1.7] whitespace-pre-wrap break-words">
        <code>
          <Prompt />whoami{"\n"}
          <span className="text-term-value">{handle}</span>
          {"\n"}
          <Prompt />ls focus/{"\n"}
          {slugs.map((slug, index) => (
            <span key={slug}>
              {slug}/{index < slugs.length - 1 ? "  " : ""}
              {index === 1 ? "\n" : ""}
            </span>
          ))}
          {"\n"}
          <Prompt />echo $MOTTO{"\n"}
          <span className="text-term-value">{motto}</span>
          {"\n"}
          <Prompt />
          <span aria-hidden="true" className="inline-block h-[1.05em] w-[0.55em] translate-y-[0.2em] bg-term-prompt motion-safe:animate-[blink_1.1s_steps(1)_infinite]" />
        </code>
      </pre>
    </figure>
  );
}

function Prompt() {
  return (
    <span className="text-term-prompt" aria-hidden="true">
      ${" "}
    </span>
  );
}
