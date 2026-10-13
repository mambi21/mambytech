import Image from "next/image";
import Link from "next/link";
import { readingMinutes } from "@/lib/content";
import type { ProjectCategory, Writing } from "@/lib/content/schema";
import { formatDate } from "@/lib/format";
import { CategoryIllustration } from "./project-visual";
import { DraftBadge } from "./projects";

/** Picks the closest illustration for an article's category when it has no cover image. */
function illustrationFor(category: string): ProjectCategory {
  const value = category.toLowerCase();
  if (value.includes("linux")) return "Linux";
  if (value.includes("aws") || value.includes("cloud")) return "Cloud Infrastructure";
  if (value.includes("code") || value.includes("automation") || value.includes("devops") || value.includes("terraform")) return "DevOps";
  return "Software Projects";
}

export function ArticleCard({ post, headingLevel = "h3" }: { post: Writing; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-rule bg-white shadow-[var(--shadow-card)] transition-[box-shadow,transform] duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)] focus-within:shadow-[var(--shadow-lift)]">
      <div className="overflow-hidden border-b border-rule bg-term">
        {post.cover ? (
          <Image
            src={post.cover.src}
            alt={post.cover.alt}
            width={post.cover.width}
            height={post.cover.height}
            sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
            className="aspect-[8/5] h-auto w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <CategoryIllustration category={illustrationFor(post.category)} className="transition-transform duration-500 group-hover:scale-[1.04]" />
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-brand-tint px-2 py-0.5 text-xs font-semibold text-brand">{post.category}</span>
          {post.publication === "draft" ? <DraftBadge /> : null}
        </p>
        <Heading className="mt-3 text-[1.1875rem] font-bold leading-snug tracking-[-0.015em]">
          <Link
            href={`/blog/${post.slug}`}
            className="after:absolute after:inset-0 after:rounded-2xl focus:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-brand"
          >
            {post.title}
          </Link>
        </Heading>
        <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-muted">{post.summary}</p>
        <p className="mt-auto pt-5 text-sm text-ink-subtle">
          {post.publishedOn ? <time dateTime={post.publishedOn}>{formatDate(post.publishedOn)}</time> : "Not yet published"}
          <span aria-hidden="true"> · </span>
          {readingMinutes(post)} min read
        </p>
      </div>
    </article>
  );
}

export function ArticleGrid({ posts, headingLevel }: { posts: Writing[]; headingLevel?: "h2" | "h3" }) {
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <li key={post.slug} className="reveal">
          <ArticleCard post={post} headingLevel={headingLevel} />
        </li>
      ))}
    </ul>
  );
}
