import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { Product } from "@/features/products/types";
import { ApiResponse } from "@/utils/types";
import { productSchema } from "@/features/products/schemas";
import { revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
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
        error: "Validation error",
        details: validationResult.error.issues
          .map((issue) => {
            const path =
              issue.path.length > 0 ? issue.path.join(".") : "root";
            return `${path}: ${issue.message}`;
          })
          .join(", "),
      };
      return NextResponse.json(response, { status: 400 });
    }

    const { techstack, ...productData } = validationResult.data;

    // Check for duplicate website URL
    const { data: existingProduct } = await supabase
      .from("products")
      .select("id, name")
      .eq("website_url", productData.website_url)
      .single();

    if (existingProduct) {
      const response: ApiResponse<null> = {
        data: null,
        success: false,
        error: "A product with this website URL has already been submitted",
      };
      return NextResponse.json(response, { status: 409 });
    }

    const { data: product, error } = await supabase
      .from("products")
      .insert({
        ...productData,
        techstack: techstack || [],
        user_id: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error("Create product error:", error);
      const response: ApiResponse<null> = {
        data: null,
        success: false,
        error: "Failed to create product",
      };
      return NextResponse.json(response, { status: 500 });
    }

    revalidatePath("/browse");
    revalidatePath("/");

    const response: ApiResponse<Product> = {
      data: product,
      success: true,
      error: null,
    };
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("POST error:", error);
    const response: ApiResponse<null> = {
      data: null,
      success: false,
      error: "Internal server error",
    };
    return NextResponse.json(response, { status: 500 });
  }
}

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      const response: ApiResponse<Product[]> = {
        data: null,
        success: false,
        error: "Unauthorized",
      };
      return NextResponse.json(response, { status: 401 });
    }

    const { data: products, error } = await supabase
      .from("products")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      const response: ApiResponse<Product[]> = {
        data: null,
        success: false,
        error: "Failed to fetch products",
      };
      return NextResponse.json(response, { status: 500 });
    }

    const response: ApiResponse<Product[]> = {
      data: products || [],
      success: true,
      error: null,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Get products error:", error);
    const response: ApiResponse<Product[]> = {
      data: null,
      success: false,
      error: "Something went wrong",
    };
    return NextResponse.json(response, { status: 500 });
  }
}
