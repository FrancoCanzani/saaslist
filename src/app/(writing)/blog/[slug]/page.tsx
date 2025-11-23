import { getAllPosts, getPostBySlug } from "@/lib/blog";
import { sanitizeHtml } from "@/utils/sanitize";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found | SaasList",
    };
  }

  const description = post.excerpt || post.title;

  return {
    title: post.title,
    description,
    alternates: {
      canonical: `${baseUrl}/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description,
      type: "article",
      publishedTime: post.date || undefined,
      url: `${baseUrl}/blog/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }


  return (
      <div className="p-4 sm:p-6 lg:p-8 space-y-8 w-full">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to blog
        </Link>

        <article className="max-w-3xl mx-auto">
          <header className="mb-8 space-y-4">
            <h1 className="text-3xl font-medium">{post.title}</h1>
            {post.date && (
              <time
                dateTime={post.date}
                className="text-sm text-muted-foreground block"
              >
                {format(new Date(post.date), "MMMM d, yyyy")}
              </time>
            )}
          </header>

          <div
            className="prose prose-sm dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }}
          />
        </article>
      </div>
  );
}
