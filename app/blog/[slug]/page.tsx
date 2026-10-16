import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { OwnerText } from "@/components/owner-text";
import { DraftBadge } from "@/components/projects";
import { ArrowLink, Container } from "@/components/ui";
import { getPost, getWriting, readingMinutes } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { pageMetadata } from "@/lib/metadata";

export const dynamicParams = false;

export function generateStaticParams() {
  return getWriting().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return pageMetadata({ title: post.title, description: post.summary, path: `/blog/${post.slug}` });
}

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <article>
      <Container className="pt-10 sm:pt-14">
        <div className="mx-auto max-w-3xl">
          <nav aria-label="Breadcrumb">
            <ol className="type-label flex flex-wrap items-center gap-2">
              <li>
                <Link href="/blog" className="link-draw hover:text-ink">
                  Writing
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-ink-muted">
                {post.title}
              </li>
            </ol>
          </nav>
          <header className="mt-8">
            <p className="flex flex-wrap items-center gap-2">
              <span className="type-label text-brand">{post.category}</span>
              {post.publication === "draft" ? <DraftBadge /> : null}
            </p>
            <h1 className="type-display mt-4 text-balance">{post.title}</h1>
            <p className="type-lead mt-5">{post.summary}</p>
            <p className="mt-5 text-sm text-ink-subtle">
              {post.publishedOn ? <time dateTime={post.publishedOn}>{formatDate(post.publishedOn)}</time> : "Not yet published"}
              <span aria-hidden="true"> · </span>
              {readingMinutes(post)} min read
            </p>
          </header>
          {post.cover ? (
            <Image
              src={post.cover.src}
              alt={post.cover.alt}
              width={post.cover.width}
              height={post.cover.height}
              sizes="(min-width: 768px) 768px, 100vw"
              preload
              className="mt-10 h-auto w-full border border-rule"
            />
          ) : null}

          <div className="mt-10 space-y-5 border-t border-rule pt-10 text-[1.0625rem] leading-[1.75] text-ink-muted">
            {post.body.map((block, index) => {
              switch (block.type) {
                case "heading":
                  return (
                    <h2 key={index} className="type-heading pt-4 text-ink">
                      <OwnerText value={block.text} />
                    </h2>
                  );
                case "paragraph":
                  return (
                    <p key={index}>
                      <OwnerText value={block.text} />
                    </p>
                  );
                case "list":
                  return (
                    <ul key={index} className="list-disc space-y-2 pl-6 marker:text-brand">
                      {block.items.map((item, i) => (
                        <li key={i}>
                          <OwnerText value={item} />
                        </li>
                      ))}
                    </ul>
                  );
                case "code":
                  return (
                    <pre key={index} className="overflow-x-auto bg-term p-5 font-mono text-[0.8125rem] leading-relaxed text-term-text" tabIndex={0}>
                      <code>{block.code}</code>
                    </pre>
                  );
              }
            })}
          </div>

          <div className="mt-14 mb-24 flex flex-wrap gap-x-10 gap-y-3 border-t border-ink pt-6">
            <ArrowLink href="/blog">All writing</ArrowLink>
            <ArrowLink href="/contact">Get in touch</ArrowLink>
          </div>
        </div>
      </Container>
    </article>
  );
}
