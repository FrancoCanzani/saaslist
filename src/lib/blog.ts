import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkHtml from "remark-html";

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt?: string;
  content: string;
  [key: string]: any; // For additional front matter fields
}

const postsDirectory = path.join(process.cwd(), "_posts");

export async function getPostSlugs(): Promise<string[]> {
  try {
    const files = await fs.readdir(postsDirectory);
    return files
      .filter((file) => file.endsWith(".md"))
      .map((file) => file.replace(/\.md$/, ""));
  } catch (error) {
    console.error("Error reading posts directory:", error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    
    // Check if file exists first
    try {
      await fs.access(fullPath);
    } catch {
      // File doesn't exist, return null silently
      return null;
    }
    
    const fileContents = await fs.readFile(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    const processedContent = await remark().use(remarkHtml).process(content);
    const contentHtml = processedContent.toString();

    return {
      slug,
      content: contentHtml,
      title: data.title || "",
      date: data.date || "",
      excerpt: data.excerpt || "",
      ...data,
    };
  } catch (error) {
    // Only log non-ENOENT errors (file not found is expected for invalid slugs)
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      console.error(`Error reading post ${slug}:`, error);
    }
    return null;
  }
}

export async function getAllPosts(): Promise<BlogPost[]> {
  const slugs = await getPostSlugs();
  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const post = await getPostBySlug(slug);
      return post;
    })
  );

  // Filter out null posts and sort by date (newest first)
  return posts
    .filter((post): post is BlogPost => post !== null)
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA;
    });
}

