"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { ProductForm } from "@/features/products/components/forms/product-form";
import { useUpdateProduct } from "@/features/products/mutations";
import { useProduct } from "@/features/products/queries";
import { productSchema } from "@/features/products/schemas";
import { createClient } from "@/lib/supabase/client";
import { getLoginUrl } from "@/utils/helpers";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { z } from "zod";

export default function EditProductPage() {
  const params = useParams();
  // fix this
  const productId = params?.id as string;
  const router = useRouter();
  const pathname = usePathname();
  const updateProductMutation = useUpdateProduct();

  const { data: product, isLoading, error } = useProduct(productId);

  useEffect(() => {
    const checkOwnership = async () => {
      if (!product) return;

      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push(getLoginUrl(pathname));
        return;
      }

      if (product.user_id !== user.id) {
        toast.error("You can only edit your own products");
        router.push(`/products/${product.id}`);
      }
    };

    checkOwnership();
  }, [product, router]);

  const handleSubmit = async (
    data: z.infer<typeof productSchema> & {
      imagesToDelete?: string[];
      removeLogo?: boolean;
    },
  ) => {
    if (!productId || !product) {
      toast.error("Product information is missing. Please refresh the page.");
      return;
    }

    try {
      const updatedProduct = await updateProductMutation.mutateAsync({
        productId,
        data,
      });
      toast.success("Product updated successfully!");
      router.push(`/products/${updatedProduct.id}`);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("logged in")) {
          router.push(getLoginUrl(pathname));
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error("Failed to update product. Please try again.");
      }
    }
  };

  if (isLoading || !productId) {
    return (
      <div className="flex items-center justify-center flex-1">
        <Spinner />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex items-center justify-center flex-1">
        <Alert className="max-w-lg mx-auto">
          <AlertDescription className="mx-auto text-balance text-center">
            The product you're trying to edit doesn't exist or you don't have
            permission to edit it.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6  space-y-8 w-full">
      <div>
        <h1 className="text-xl font-medium">Edit Product</h1>
        <h2 className="text-sm text-muted-foreground">
          Update your product information
        </h2>
      </div>

      <ProductForm
        onSubmit={handleSubmit}
        defaultValues={{
          name: product.name,
          tagline: product.tagline,
          website_url: product.website_url,
          repo_url: product.repo_url,
          description: product.description,
          tags: product.tags,
          techstack: product.techstack || [],
          logo_url: product.logo_url,
          demo_url: product.demo_url,
          pricing_model: product.pricing_model,
          twitter_url: product.twitter_url,
          linkedin_url: product.linkedin_url,
          instagram_url: product.instagram_url,
          platforms: product.platforms,
        }}
        existingImages={product.images || []}
        existingLogoUrl={product.logo_url || undefined}
        isSubmitting={updateProductMutation.isPending}
        submitButtonText="Update Product"
        onCancel={() => router.push(`/products/${product.id}`)}
      />
    </div>
  );
}
