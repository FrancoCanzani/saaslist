"use client";

import { ProductForm } from "@/features/products/components/product-form";
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
    <div className="p-6 sm:p-8 space-y-8">
      <div className="">
        <h1 className="text-xl font-mono font-medium">Submit a Product</h1>
        <h2 className="text-sm text-gray-600 dark:text-muted-foreground">
          Share your SaaS with the community
        </h2>
      </div>

      <ProductForm
        onSubmit={handleSubmit}
        isSubmitting={createProductMutation.isPending}
      />
    </div>
  );
}
