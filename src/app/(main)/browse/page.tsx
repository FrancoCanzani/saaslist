import { getAllCategoriesWithProducts } from "@/features/browse/api/get-all-categories-with-products";
import { BrowseContent } from "@/features/browse/components/browse-content";

export const revalidate = 600;

export default async function BrowsePage() {
  const categories = await getAllCategoriesWithProducts();

  return <BrowseContent categories={categories} />;
}
