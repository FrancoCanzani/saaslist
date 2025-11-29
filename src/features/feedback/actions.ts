"use server";

import { createClient } from "@/lib/supabase/server";
import { ActionResponse } from "@/utils/types";
import { feedbackSchema, Feedback } from "./schemas";

export async function submitFeedbackAction(
  data: Feedback
): Promise<ActionResponse> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: "You must be logged in to submit feedback",
      };
    }

    const validated = feedbackSchema.parse(data);

    const { error } = await supabase.from("feedback").insert({
      user_id: user.id,
      message: validated.message,
    });

    if (error) {
      console.error("Feedback submission error:", error);
      return {
        success: false,
        error: "Failed to submit feedback. Please try again.",
      };
    }

    return { success: true, action: "submitted" };
  } catch (error) {
    console.error("Feedback action error:", error);

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: "Something went wrong. Please try again.",
    };
  }
}

