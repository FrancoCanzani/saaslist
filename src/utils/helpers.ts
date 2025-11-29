import { categories } from "./constants/categories";
import { Category } from "./types";

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    return false;
  }
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((cat) => cat.slug === slug);
}

export function getCategoryByName(name: string): Category | undefined {
  return categories.find((cat) => cat.name.toLowerCase() === name.toLowerCase());
}

export function getCategoryByTag(tag: string): Category | undefined {
  return categories.find((cat) =>
    cat.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
  );
}

export function getTagSlug(tag: string): string {
  return tag.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "and");
}

export function getAllCategorySlugs(): string[] {
  return categories.map((cat) => cat.slug);
}

export function getAllTags(): string[] {
  return Array.from(
    new Set(categories.flatMap((cat) => cat.tags))
  );
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
