import { ApiResponse, Product } from "@/features/products/types";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data: product, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !product) {
      const response: ApiResponse<null> = {
        data: null,
        success: false,
        error: "Product not found",
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse<Product> = {
      data: product,
      success: true,
      error: null,
    };
    return NextResponse.json(response);
  } catch (error) {
    console.error("GET error:", error);
    const response: ApiResponse<null> = {
      data: null,
      success: false,
      error: "Internal server error",
    };
    return NextResponse.json(response, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const { data: existingProduct, error: fetchError } = await supabase
      .from("products")
      .select("user_id")
      .eq("id", id)
      .single();

    if (fetchError || !existingProduct) {
      const response: ApiResponse<null> = {
        data: null,
        success: false,
        error: "Product not found",
      };
      return NextResponse.json(response, { status: 404 });
    }

    if (existingProduct.user_id !== user.id) {
      const response: ApiResponse<null> = {
        data: null,
        success: false,
        error: "Forbidden",
      };
      return NextResponse.json(response, { status: 403 });
    }

    const body = await request.json();

    // Update the product
    const { data: updatedProduct, error: updateError } = await supabase
      .from("products")
      .update(body)
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      console.error("Update error:", updateError);
      const response: ApiResponse<null> = {
        data: null,
        success: false,
        error: "Failed to update product",
      };
      return NextResponse.json(response, { status: 500 });
    }

    revalidatePath("/browse");
    revalidatePath(`/products/${id}`);

    const response: ApiResponse<Product> = {
      data: updatedProduct,
      success: true,
      error: null,
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("PATCH error:", error);
    const response: ApiResponse<null> = {
      data: null,
      success: false,
      error: "Internal server error",
    };
    return NextResponse.json(response, { status: 500 });
  }
}

