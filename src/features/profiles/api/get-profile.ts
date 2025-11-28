import { createClient } from "@/lib/supabase/server";
import { cache } from "react";
import { Profile } from "../types";

export const getProfile = cache(async (userId: string): Promise<Profile | null> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    console.error("Error fetching profile:", error);
    return null;
  }

  return data;
});

