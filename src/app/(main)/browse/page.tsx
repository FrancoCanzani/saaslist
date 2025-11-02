import { getProductTags } from "@/features/browse/api";
import { BrowseContent } from "@/features/browse/components/browse-content";

export const revalidate = 600;

export default async function BrowsePage() {
  const products = await getProductTags();

  return <BrowseContent products={products} />;
}
