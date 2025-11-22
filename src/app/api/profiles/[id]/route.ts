import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !profile) {
      return NextResponse.json(
        { data: null, success: false, error: "Profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: profile,
      success: true,
      error: null,
    });
  } catch (error) {
    console.error("GET profile error:", error);
    return NextResponse.json(
      { data: null, success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

