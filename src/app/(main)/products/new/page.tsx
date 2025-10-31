"use client";

import { ProductForm } from "@/features/products/components/new-product-form";
import { useCreateProduct } from "@/features/products/mutations";
import { productSchema } from "@/features/products/schemas";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

export default function NewProductPage() {
  const router = useRouter();
  const createProductMutation = useCreateProduct();

  const handleSubmit = async (data: z.infer<typeof productSchema>) => {
    try {
      await createProductMutation.mutateAsync(data);
      toast.success("Product submitted successfully!");
      router.push("/");
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("logged in")) {
          router.push("/login");
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error("Failed to submit product. Please try again.");
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-medium">Submit a Product</h1>
          <p className="text-sm">Share your SaaS with the community</p>
        </div>

        <ProductForm
          onSubmit={handleSubmit}
          isSubmitting={createProductMutation.isPending}
        />
      </div>
    </div>
  );
}
