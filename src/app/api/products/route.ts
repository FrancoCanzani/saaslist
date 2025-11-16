import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { ApiResponse, Product } from "@/features/products/types";

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
