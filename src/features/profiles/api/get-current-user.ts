import { createClient } from "@/lib/supabase/server";
import { cache } from "react";
import { Profile } from "../types";
import { getProfile } from "./get-profile";

export const getCurrentUser = cache(async () => {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { user: null, profile: null };
  }

  const profile = await getProfile(user.id);

  return { user, profile };
});

