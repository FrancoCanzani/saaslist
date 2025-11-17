import { getAllPosts } from "@/lib/blog";
import { format } from "date-fns";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog - SaasList",
  description: "Latest articles and updates from SaasList",
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <div>
        <h1 className="text-xl font-medium">Blog</h1>
        <h2 className="text-muted-foreground text-sm">
          Latest articles and updates
        </h2>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No blog posts yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="border rounded p-6 hover:border-blaze-orange transition-colors"
            >
              <h2 className="text-xl font-medium mb-2 ">{post.title}</h2>
              {post.excerpt && (
                <p className="text-muted-foreground text-sm mb-4">
                  {post.excerpt}
                </p>
              )}
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                {post.date && (
                  <time dateTime={post.date}>
                    {format(new Date(post.date), "MMMM d, yyyy")}
                  </time>
                )}
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-blaze-orange hover:underline"
                >
                  Read more →
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
