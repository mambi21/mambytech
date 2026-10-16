import Link from "next/link";
import { readingMinutes } from "@/lib/content";
import type { Writing } from "@/lib/content/schema";
import { formatDate } from "@/lib/format";
import { DraftBadge } from "./projects";
import { ArrowIcon } from "./ui";

/** Articles as an editorial list: date and category in mono, the title large, the summary beneath. */
export function ArticleList({ posts, headingLevel = "h3" }: { posts: Writing[]; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  return (
    <ol className="border-t border-ink">
      {posts.map((post) => (
        <li key={post.slug} className="group relative grid grid-cols-12 gap-x-8 gap-y-2 border-b border-rule py-7 transition-colors hover:border-ink">
          <p className="type-label col-span-12 lg:col-span-3">
            {post.publishedOn ? <time dateTime={post.publishedOn}>{formatDate(post.publishedOn)}</time> : "Unpublished"}
            <span aria-hidden="true"> · </span>
            {post.category}
          </p>
          <div className="col-span-12 lg:col-span-7">
            <Heading className="type-heading text-balance">
              <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0 focus:outline-none focus-visible:after:outline-2 focus-visible:after:outline-brand">
                {post.title}
              </Link>
            </Heading>
            <p className="mt-2 text-ink-muted">{post.summary}</p>
            {post.publication === "draft" ? (
              <p className="mt-3">
                <DraftBadge />
              </p>
            ) : null}
          </div>
          <p className="type-mono col-span-12 flex items-start gap-2 text-ink-subtle lg:col-span-2 lg:justify-end">
            {readingMinutes(post)} min
            <ArrowIcon className="mt-1 text-brand transition-transform duration-300 group-hover:translate-x-1" />
          </p>
        </li>
      ))}
    </ol>
  );
}
