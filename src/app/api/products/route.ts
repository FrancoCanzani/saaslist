import { productSchema } from "@/features/products/schemas";
import { ApiResponse, Product } from "@/features/products/types";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      const response: ApiResponse<null> = {
        data: null,
        success: false,
        error: "Unauthorized",
      };
      return NextResponse.json(response, { status: 401 });
    }

    const body = await request.json();
    const validationResult = productSchema.safeParse(body);

    if (!validationResult.success) {
      const response: ApiResponse<null> = {
        data: null,
        success: false,
        error: "Validation failed",
        details: z.prettifyError(validationResult.error),
      };
      return NextResponse.json(response, { status: 400 });
    }

    const productData = validationResult.data;

    const dbProductData = {
      name: productData.name,
      tagline: productData.tagline,
      description: productData.description,
      website_url: productData.website_url,
      repo_url: productData.repo_url || null,
      logo_url: productData.logo_url || null,
      demo_url: productData.demo_url || null,
      pricing_model: productData.pricing_model,
      promo_code: productData.promo_code || null,
      tags: productData.tags,
      twitter_url: productData.twitter_url || null,
      linkedin_url: productData.linkedin_url || null,
      product_hunt_url: productData.product_hunt_url || null,
      platforms: productData.platforms,
      user_id: user.id,
      upvotes_count: 0,
      comments_count: 0,
    };

    const { data: newProduct, error: insertError } = await supabase
      .from("products")
      .insert(dbProductData)
      .select()
      .single();

    if (insertError) {
      const response: ApiResponse<null> = {
        data: null,
        success: false,
        error: "Failed to create product",
      };
      return NextResponse.json(response, { status: 500 });
    }

    revalidatePath("/browse");

    const response: ApiResponse<Product> = {
      data: newProduct,
      success: true,
      error: null,
    };
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    const response: ApiResponse<null> = {
      data: null,
      success: false,
      error: "Internal server error",
    };
    return NextResponse.json(response, { status: 500 });
  }
}
