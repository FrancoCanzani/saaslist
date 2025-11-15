"use client";

import { ProductForm } from "@/features/products/components/product-form";
import { useProduct } from "@/features/products/queries";
import { useUpdateProduct } from "@/features/products/mutations";
import { productSchema } from "@/features/products/schemas";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import { createClient } from "@/utils/supabase/client";
import { useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";

export default function EditProductPage() {
  const params = useParams();
  const productId = params?.id as string;
  const router = useRouter();
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
        router.push("/login");
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
    }
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
          router.push("/login");
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
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="text-center space-y-4">
          <h1 className="text-xl font-medium">Product Not Found</h1>
          <p className="text-sm text-muted-foreground">
            The product you're trying to edit doesn't exist or you don't have
            permission to edit it.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="">
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
          is_open_source: !!product.repo_url,
          description: product.description,
          tags: product.tags,
          logo_url: product.logo_url,
          demo_url: product.demo_url,
          pricing_model: product.pricing_model,
          twitter_url: product.twitter_url,
          linkedin_url: product.linkedin_url,
          product_hunt_url: product.product_hunt_url,
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

