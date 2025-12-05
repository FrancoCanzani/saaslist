import { NextResponse } from "next/server";
import { ApiResponse } from "@/utils/types";
import { getAllProducts } from "@/features/products/api/get-all-products";

export async function GET() {
  try {
    const products = await getAllProducts();

    const response: ApiResponse<typeof products> = {
      data: products,
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

