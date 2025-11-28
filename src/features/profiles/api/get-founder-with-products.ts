import { createClient } from "@/lib/supabase/server";
import { cache } from "react";
import { Profile } from "../types";

interface FounderProduct {
  id: string;
  name: string;
  tagline: string | null;
  logo_url: string | null;
}

interface FounderWithProducts {
  profile: Profile;
  products: FounderProduct[];
}

export const getFounderWithProducts = cache(
  async (userId: string): Promise<FounderWithProducts | null> => {
    const supabase = await createClient();

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (profileError || !profile) {
      return null;
    }

    const { data: products } = await supabase
      .from("products")
      .select("id, name, tagline, logo_url")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    return {
      profile,
      products: products || [],
    };
  }
);

