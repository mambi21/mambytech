import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleGrid } from "@/components/articles";
import { Container, PageHeader } from "@/components/ui";
import { getWriting } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { isPreview } from "@/lib/preview";

export const metadata: Metadata = pageMetadata({
  title: "Blog",
  description: "Technical articles by Ibrahima Mamby Bah on Linux, AWS, infrastructure as code, and automation.",
  path: "/blog",
});

/** Shown only once at least one post is published (or in preview mode). */
export default function BlogPage() {
  const posts = getWriting();
  if (posts.length === 0) notFound();

  return (
    <>
      <PageHeader label="Blog" title="Engineering notes">
        <p>Practical write-ups from operating Linux systems, AWS infrastructure, and automation.</p>
      </PageHeader>
      <Container className="pt-12">
        {isPreview ? (
          <p className="mb-10 rounded-xl border border-dashed border-owner-line bg-owner-bg px-4 py-3 text-[0.9375rem] text-owner">
            Preview: draft posts are listed below. They stay out of production until their <code className="font-mono">publication</code> is
            set to <code className="font-mono">&quot;published&quot;</code> with a real <code className="font-mono">publishedOn</code> date.
          </p>
        ) : null}
        <h2 className="sr-only">Articles</h2>
        <ArticleGrid posts={posts} />
      </Container>
    </>
  );
}
