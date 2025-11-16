"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { profileUpdateSchema } from "./schemas";

export async function updateProfileAction(data: {
  name?: string;
  avatar_url?: string;
  twitter?: string;
  website?: string;
}) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("You must be logged in to update your profile");
    }

    const validated = profileUpdateSchema.parse(data);

    const updates: Record<string, string | null> = {};
    if (validated.name !== undefined) {
      updates.name = validated.name || null;
    }
    if (validated.avatar_url !== undefined) {
      updates.avatar_url = validated.avatar_url || null;
    }
    if (validated.twitter !== undefined) {
      updates.twitter = validated.twitter || null;
    }
    if (validated.website !== undefined) {
      updates.website = validated.website || null;
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)
      .select()
      .single();

    if (error) {
      throw new Error("Failed to update profile");
    }

    revalidatePath("/profile");
    revalidatePath("/");

    return { success: true, data: profile };
  } catch (error) {
    console.error("Update profile error:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Something went wrong");
  }
}

