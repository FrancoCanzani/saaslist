"use client";

import { ProductForm } from "@/features/products/components/forms/product-form";
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
      const product = await createProductMutation.mutateAsync(data);
      toast.success("Product submitted successfully!");
      router.push(`/products/${product.id}/success`);
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
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 w-full">
      <div className="">
        <h1 className="text-xl font-medium">Submit a Product</h1>
        <h2 className="text-sm text-muted-foreground">
          It will only take a minute
        </h2>
      </div>

      <ProductForm
        onSubmit={handleSubmit}
        isSubmitting={createProductMutation.isPending}
      />
    </div>
  );
}
