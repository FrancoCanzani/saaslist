"use server";

import { createClient } from "@/utils/supabase/server";
import { Product, Comment, Review } from "./types";
import { revalidatePath } from "next/cache";
import { ActionResponse } from "@/utils/types";
import { commentSchema, reviewSchema } from "./schemas";

export async function handleUpvoteAction(
  product: Product
): Promise<ActionResponse> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("You must be logged in to upvote products");
    }

    if (product.is_upvoted) {
      const { data: deletedUpvote, error: deleteError } = await supabase
        .from("upvotes")
        .delete()
        .eq("product_id", product.id)
        .eq("user_id", user.id)
        .select();

      if (deleteError) {
        throw new Error("Failed to remove upvote. Please try again.");
      }

      revalidatePath("/");
      revalidatePath("/browse");
      
      return { success: true, action: "removed", data: deletedUpvote };
    } else {
      const { data: insertedUpvote, error: insertError } = await supabase
        .from("upvotes")
        .insert({
          user_id: user.id,
          product_id: product.id,
        })
        .select();

      if (insertError) {        
        if (insertError.code === "23505") {
          throw new Error("You have already upvoted this product");
        }
        
        throw new Error("Failed to add upvote. Please try again.");
      }

      revalidatePath("/");
      revalidatePath("/browse");
      
      return { success: true, action: "added", data: insertedUpvote };
    }
  } catch (error) {
    console.error("Upvote action error:", error);
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error("Something went wrong. Please try again.");
  }
}

export async function createCommentAction(data: {
  content: string;
  product_id: string;
  parent_id?: string | null;
}): Promise<ActionResponse<Comment>> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("You must be logged in to comment");
    }

    const validated = commentSchema.parse(data);

    const { data: comment, error } = await supabase
      .from("comments")
      .insert({
        content: validated.content,
        product_id: validated.product_id,
        parent_id: validated.parent_id || null,
        user_id: user.id,
      })
      .select(
        `
        *,
        user:profiles!comments_user_id_fkey(name, avatar_url)
      `
      )
      .single();

    if (error) {
      throw new Error("Failed to create comment");
    }

    revalidatePath(`/products/${validated.product_id}`);
    return { success: true, data: comment, action: "created" };
  } catch (error) {
    console.error("Create comment error:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Something went wrong");
  }
}

export async function updateCommentAction(
  commentId: string,
  content: string,
  productId: string
): Promise<ActionResponse<Comment>> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("You must be logged in to edit comments");
    }

    const { data: existingComment } = await supabase
      .from("comments")
      .select("user_id")
      .eq("id", commentId)
      .single();

    if (!existingComment || existingComment.user_id !== user.id) {
      throw new Error("You can only edit your own comments");
    }

    const validated = commentSchema.parse({
      content,
      product_id: productId,
    });

    const { data: comment, error } = await supabase
      .from("comments")
      .update({
        content: validated.content,
        updated_at: new Date().toISOString(),
      })
      .eq("id", commentId)
      .select(
        `
        *,
        user:profiles!comments_user_id_fkey(name, avatar_url)
      `
      )
      .single();

    if (error) {
      throw new Error("Failed to update comment");
    }

    revalidatePath(`/products/${productId}`);
    return { success: true, data: comment, action: "updated" };
  } catch (error) {
    console.error("Update comment error:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Something went wrong");
  }
}

export async function deleteCommentAction(
  commentId: string,
  productId: string
): Promise<ActionResponse> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("You must be logged in to delete comments");
    }

    const { data: existingComment } = await supabase
      .from("comments")
      .select("user_id")
      .eq("id", commentId)
      .single();

    if (!existingComment || existingComment.user_id !== user.id) {
      throw new Error("You can only delete your own comments");
    }

    const { error } = await supabase.from("comments").delete().eq("id", commentId);

    if (error) {
      throw new Error("Failed to delete comment");
    }

    revalidatePath(`/products/${productId}`);
    return { success: true, action: "deleted" };
  } catch (error) {
    console.error("Delete comment error:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Something went wrong");
  }
}

export async function flagCommentAction(
  commentId: string,
  productId: string
): Promise<ActionResponse> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("You must be logged in to flag comments");
    }

    const { error } = await supabase
      .from("comments")
      .update({ is_flagged: true })
      .eq("id", commentId);

    if (error) {
      throw new Error("Failed to flag comment");
    }

    revalidatePath(`/products/${productId}`);
    return { success: true, action: "flagged" };
  } catch (error) {
    console.error("Flag comment error:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Something went wrong");
  }
}

export async function createReviewAction(data: {
  rating: number;
  title?: string;
  content: string;
  product_id: string;
}): Promise<ActionResponse<Review>> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("You must be logged in to leave a review");
    }

    const validated = reviewSchema.parse(data);

    const { data: existingReview } = await supabase
      .from("reviews")
      .select("id")
      .eq("user_id", user.id)
      .eq("product_id", validated.product_id)
      .single();

    if (existingReview) {
      throw new Error("You have already reviewed this product");
    }

    const { data: review, error } = await supabase
      .from("reviews")
      .insert({
        rating: validated.rating,
        title: validated.title || null,
        content: validated.content,
        product_id: validated.product_id,
        user_id: user.id,
      })
      .select(
        `
        *,
        user:profiles!reviews_user_id_fkey(name, avatar_url)
      `
      )
      .single();

    if (error) {
      throw new Error("Failed to create review");
    }

    revalidatePath(`/products/${validated.product_id}`);
    revalidatePath("/");
    revalidatePath("/browse");
    return { success: true, data: review, action: "created" };
  } catch (error) {
    console.error("Create review error:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Something went wrong");
  }
}

export async function deleteReviewAction(
  reviewId: string,
  productId: string
): Promise<ActionResponse> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("You must be logged in to delete reviews");
    }

    const { data: existingReview } = await supabase
      .from("reviews")
      .select("user_id")
      .eq("id", reviewId)
      .single();

    if (!existingReview || existingReview.user_id !== user.id) {
      throw new Error("You can only delete your own reviews");
    }

    const { error } = await supabase.from("reviews").delete().eq("id", reviewId);

    if (error) {
      throw new Error("Failed to delete review");
    }

    revalidatePath(`/products/${productId}`);
    revalidatePath("/");
    revalidatePath("/browse");
    return { success: true, action: "deleted" };
  } catch (error) {
    console.error("Delete review error:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Something went wrong");
  }
}
