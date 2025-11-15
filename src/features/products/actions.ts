"use server";

import { createClient } from "@/utils/supabase/server";
import { Product, Comment, Review, Update } from "./types";
import { revalidatePath } from "next/cache";
import { ActionResponse } from "@/utils/types";
import { commentSchema, reviewSchema, updateSchema } from "./schemas";
import { generateStoragePath, generateProductImagePath, extractStoragePathFromUrl } from "./helpers";

export async function handleUpvoteAction(
  product: Product
): Promise<ActionResponse> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { 
        success: false, 
        error: "You must be logged in to upvote products" 
      };
    }

    if (product.is_upvoted) {
      const { data: deletedUpvote, error: deleteError } = await supabase
        .from("upvotes")
        .delete()
        .eq("product_id", product.id)
        .eq("user_id", user.id)
        .select();

      if (deleteError) {
        return { 
          success: false, 
          error: "Failed to remove upvote. Please try again." 
        };
      }

      revalidatePath("/");
      revalidatePath("/browse");
      revalidatePath(`/products/${product.id}`);
      
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
          return { 
            success: false, 
            error: "You have already upvoted this product" 
          };
        }
        
        return { 
          success: false, 
          error: "Failed to add upvote. Please try again." 
        };
      }

      revalidatePath("/");
      revalidatePath("/browse");
      revalidatePath(`/products/${product.id}`);
      
      return { success: true, action: "added", data: insertedUpvote };
    }
  } catch (error) {
    console.error("Upvote action error:", error);
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : "Something went wrong. Please try again.";
    
    return { 
      success: false, 
      error: errorMessage 
    };
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

export async function deleteProductAction(
  productId: string
): Promise<ActionResponse> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("You must be logged in to delete products");
    }

    const { data: existingProduct, error: fetchError } = await supabase
      .from("products")
      .select("user_id")
      .eq("id", productId)
      .single();

    if (fetchError || !existingProduct) {
      throw new Error("Product not found");
    }

    if (existingProduct.user_id !== user.id) {
      throw new Error("You can only delete your own products");
    }

    const { error: deleteError } = await supabase
      .from("products")
      .delete()
      .eq("id", productId);

    if (deleteError) {
      throw new Error("Failed to delete product");
    }

    revalidatePath("/my-products");
    revalidatePath("/");
    revalidatePath("/browse");
    revalidatePath("/leaderboard");
    revalidatePath(`/products/${productId}`);

    return { success: true, action: "deleted" };
  } catch (error) {
    console.error("Delete product error:", error);
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

export async function uploadProductLogo(
  file: File
): Promise<{ url: string; path: string }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("You must be logged in to upload files");
    }

    const filePath = generateStoragePath(user.id, file.name);
    
    const { data, error } = await supabase.storage
      .from("product-logos")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      throw new Error(`Failed to upload logo: ${error.message}`);
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("product-logos").getPublicUrl(data.path);

    return { url: publicUrl, path: data.path };
  } catch (error) {
    console.error("Upload logo error:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to upload logo");
  }
}

export async function uploadProductImages(
  files: File[],
  productId: string
): Promise<string[]> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("You must be logged in to upload files");
    }

    const uploadPromises = files.map(async (file) => {
      const filePath = generateProductImagePath(user.id, productId, file.name);

      const { data, error } = await supabase.storage
        .from("product-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        throw new Error(`Failed to upload image: ${error.message}`);
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("product-images").getPublicUrl(data.path);

      return publicUrl;
    });

    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error("Upload images error:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to upload images");
  }
}

export async function deleteUploadedAssets(
  paths: string[],
  bucket: "product-logos" | "product-images"
): Promise<void> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("You must be logged in to delete files");
    }

    const { error } = await supabase.storage.from(bucket).remove(paths);

    if (error) {
      console.error("Failed to delete assets:", error);
    }
  } catch (error) {
    console.error("Delete assets error:", error);
  }
}

export async function createUpdateAction(data: {
  title: string;
  content: string;
  product_id: string;
}): Promise<ActionResponse<Update>> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("You must be logged in to create updates");
    }

    // Verify user owns the product
    const { data: product } = await supabase
      .from("products")
      .select("user_id")
      .eq("id", data.product_id)
      .single();

    if (!product || product.user_id !== user.id) {
      throw new Error("You can only create updates for your own products");
    }

    const validated = updateSchema.parse(data);

    const { data: update, error } = await supabase
      .from("product_updates")
      .insert({
        title: validated.title,
        content: validated.content,
        product_id: validated.product_id,
        user_id: user.id,
      })
      .select(
        `
        *,
        user:profiles!product_updates_user_id_fkey(name, avatar_url)
      `
      )
      .single();

    if (error) {
      throw new Error("Failed to create update");
    }

    revalidatePath(`/products/${validated.product_id}`);
    return { success: true, data: update, action: "created" };
  } catch (error) {
    console.error("Create update error:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Something went wrong");
  }
}

export async function updateUpdateAction(data: {
  updateId: string;
  title: string;
  content: string;
  product_id: string;
}): Promise<ActionResponse<Update>> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("You must be logged in to edit updates");
    }

    const { data: existingUpdate } = await supabase
      .from("product_updates")
      .select("user_id")
      .eq("id", data.updateId)
      .single();

    if (!existingUpdate || existingUpdate.user_id !== user.id) {
      throw new Error("You can only edit your own updates");
    }

    const validated = updateSchema.parse({
      title: data.title,
      content: data.content,
      product_id: data.product_id,
    });

    const { data: update, error } = await supabase
      .from("product_updates")
      .update({
        title: validated.title,
        content: validated.content,
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.updateId)
      .select(
        `
        *,
        user:profiles!product_updates_user_id_fkey(name, avatar_url)
      `
      )
      .single();

    if (error) {
      throw new Error("Failed to update update");
    }

    revalidatePath(`/products/${data.product_id}`);
    return { success: true, data: update, action: "updated" };
  } catch (error) {
    console.error("Update update error:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Something went wrong");
  }
}

export async function deleteUpdateAction(
  updateId: string,
  productId: string
): Promise<ActionResponse> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("You must be logged in to delete updates");
    }

    // Verify user owns the update
    const { data: existingUpdate } = await supabase
      .from("product_updates")
      .select("user_id")
      .eq("id", updateId)
      .single();

    if (!existingUpdate || existingUpdate.user_id !== user.id) {
      throw new Error("You can only delete your own updates");
    }

    const { error } = await supabase
      .from("product_updates")
      .delete()
      .eq("id", updateId);

    if (error) {
      throw new Error("Failed to delete update");
    }

    revalidatePath(`/products/${productId}`);
    return { success: true, action: "deleted" };
  } catch (error) {
    console.error("Delete update error:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Something went wrong");
  }
}

export async function updateProductAction(
  productId: string,
  data: {
    name?: string;
    tagline?: string;
    description?: string;
    website_url?: string;
    repo_url?: string;
    logo_url?: string | null;
    images?: string[];
    demo_url?: string;
    pricing_model?: "free" | "freemium" | "premium";
    tags?: string[];
    twitter_url?: string;
    linkedin_url?: string;
    product_hunt_url?: string;
    platforms?: string[];
    logo_file?: File | null;
    image_files?: File[];
    imagesToDelete?: string[];
    removeLogo?: boolean;
  }
): Promise<ActionResponse<Product>> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("You must be logged in to update products");
    }

    const { data: existingProduct, error: fetchError } = await supabase
      .from("products")
      .select("user_id, logo_url, images")
      .eq("id", productId)
      .single();

    if (fetchError || !existingProduct) {
      throw new Error("Product not found");
    }

    if (existingProduct.user_id !== user.id) {
      throw new Error("You can only update your own products");
    }

    const uploadedAssets: Array<{ path: string; bucket: "product-logos" | "product-images" }> = [];
    let logoUrl = data.logo_url;
    let oldLogoPath: string | null = null;

    if (data.logo_file) {
      const { url, path } = await uploadProductLogo(data.logo_file);
      logoUrl = url;
      uploadedAssets.push({ path, bucket: "product-logos" });

      if (existingProduct.logo_url) {
        const oldPath = extractStoragePathFromUrl(
          existingProduct.logo_url,
          "product-logos"
        );
        if (oldPath) {
          oldLogoPath = oldPath;
        }
      }
    } else if (data.removeLogo || data.logo_url === null) {
      logoUrl = null;
      if (existingProduct.logo_url) {
        const oldPath = extractStoragePathFromUrl(
          existingProduct.logo_url,
          "product-logos"
        );
        if (oldPath) {
          oldLogoPath = oldPath;
        }
      }
    } else if (data.logo_url !== undefined) {
      logoUrl = data.logo_url;
    }

    const imagesToDeletePaths: string[] = [];
    if (data.imagesToDelete && data.imagesToDelete.length > 0) {
      data.imagesToDelete.forEach((url) => {
        const path = extractStoragePathFromUrl(url, "product-images");
        if (path) {
          imagesToDeletePaths.push(path);
        }
      });
    }

    let newImageUrls: string[] = [];
    if (data.image_files && data.image_files.length > 0) {
      newImageUrls = await uploadProductImages(data.image_files, productId);
       }

    let finalImages: string[] = [];
    if (data.images !== undefined) {
      finalImages = data.images;
    } else {
      const existingImages = existingProduct.images || [];
      const keptImages = existingImages.filter(
        (url: string) => !data.imagesToDelete?.includes(url)
      );
      finalImages = [...keptImages, ...newImageUrls];
    }

    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (data.name !== undefined) updateData.name = data.name;
    if (data.tagline !== undefined) updateData.tagline = data.tagline;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.website_url !== undefined) updateData.website_url = data.website_url;
    if (data.repo_url !== undefined) updateData.repo_url = data.repo_url || null;
    if (logoUrl !== undefined) updateData.logo_url = logoUrl;
    if (finalImages !== undefined) updateData.images = finalImages;
    if (data.demo_url !== undefined) updateData.demo_url = data.demo_url || null;
    if (data.pricing_model !== undefined) updateData.pricing_model = data.pricing_model;
    if (data.tags !== undefined) updateData.tags = data.tags;
    if (data.twitter_url !== undefined) updateData.twitter_url = data.twitter_url || null;
    if (data.linkedin_url !== undefined) updateData.linkedin_url = data.linkedin_url || null;
    if (data.product_hunt_url !== undefined) updateData.product_hunt_url = data.product_hunt_url || null;
    if (data.platforms !== undefined) updateData.platforms = data.platforms;

    const { data: updatedProduct, error: updateError } = await supabase
      .from("products")
      .update(updateData)
      .eq("id", productId)
      .select()
      .single();

    if (updateError) {
      if (uploadedAssets.length > 0) {
        for (const asset of uploadedAssets) {
          await deleteUploadedAssets([asset.path], asset.bucket);
        }
      }
      throw new Error(`Failed to update product: ${updateError.message}`);
    }

    if (oldLogoPath) {
      await deleteUploadedAssets([oldLogoPath], "product-logos");
    }
    if (imagesToDeletePaths.length > 0) {
      await deleteUploadedAssets(imagesToDeletePaths, "product-images");
    }

    revalidatePath("/browse");
    revalidatePath("/");
    revalidatePath("/my-products");
    revalidatePath(`/products/${productId}`);

    return { success: true, data: updatedProduct, action: "updated" };
  } catch (error) {
    console.error("Update product error:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Something went wrong");
  }
}
