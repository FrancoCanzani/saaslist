import { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";
import { categories } from "@/utils/constants";
import { getTagSlug } from "@/utils/helpers";
import { getAllPosts } from "@/lib/blog";

export const revalidate = 3600; // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const currentDate = new Date();

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Static pages
  sitemapEntries.push({
    url: baseUrl,
    lastModified: currentDate,
    changeFrequency: "daily",
    priority: 1.0,
  });

  sitemapEntries.push({
    url: `${baseUrl}/browse`,
    lastModified: currentDate,
    changeFrequency: "daily",
    priority: 0.9,
  });

  sitemapEntries.push({
    url: `${baseUrl}/leaderboard`,
    lastModified: currentDate,
    changeFrequency: "hourly",
    priority: 0.8,
  });

  sitemapEntries.push({
    url: `${baseUrl}/newsletter`,
    lastModified: currentDate,
    changeFrequency: "monthly",
    priority: 0.6,
  });

  sitemapEntries.push({
    url: `${baseUrl}/advertise`,
    lastModified: currentDate,
    changeFrequency: "monthly",
    priority: 0.6,
  });

  sitemapEntries.push({
    url: `${baseUrl}/blog`,
    lastModified: currentDate,
    changeFrequency: "weekly",
    priority: 0.7,
  });

  // Get all products
  try {
    const supabase = await createClient();
    const { data: products } = await supabase
      .from("products")
      .select("id, updated_at, created_at")
      .order("created_at", { ascending: false });

    if (products) {
      products.forEach((product) => {
        sitemapEntries.push({
          url: `${baseUrl}/products/${product.id}`,
          lastModified: product.updated_at
            ? new Date(product.updated_at)
            : new Date(product.created_at),
          changeFrequency: "weekly",
          priority: 0.8,
        });
      });
    }
  } catch (error) {
    console.error("Error fetching products for sitemap:", error);
  }

  // Category pages
  categories.forEach((category) => {
    sitemapEntries.push({
      url: `${baseUrl}/browse/${category.slug}`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.7,
    });

    // Tag pages
    category.tags.forEach((tag) => {
      sitemapEntries.push({
        url: `${baseUrl}/browse/${category.slug}/${getTagSlug(tag)}`,
        lastModified: currentDate,
        changeFrequency: "daily",
        priority: 0.6,
      });
    });
  });

  // Blog posts
  try {
    const posts = await getAllPosts();
    posts.forEach((post) => {
      sitemapEntries.push({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: post.date ? new Date(post.date) : currentDate,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    });
  } catch (error) {
    console.error("Error fetching blog posts for sitemap:", error);
  }

  return sitemapEntries;
}
