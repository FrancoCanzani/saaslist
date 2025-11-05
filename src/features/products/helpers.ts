import { Comment, Review, ReviewSortOption, SortOption } from "./types";

export function buildCommentTree(comments: Comment[]): Comment[] {
  const commentMap = new Map<string, Comment>();
  const rootComments: Comment[] = [];

  comments.forEach((comment) => {
    commentMap.set(comment.id, { ...comment, replies: [] });
  });

  comments.forEach((comment) => {
    const commentWithReplies = commentMap.get(comment.id)!;

    if (comment.parent_id) {
      const parent = commentMap.get(comment.parent_id);
      if (parent) {
        parent.replies = parent.replies || [];
        parent.replies.push(commentWithReplies);
      } else {
        rootComments.push(commentWithReplies);
      }
    } else {
      rootComments.push(commentWithReplies);
    }
  });

  const calculateReplyCount = (comment: Comment): number => {
    if (!comment.replies || comment.replies.length === 0) return 0;
    return comment.replies.reduce(
      (count, reply) => count + 1 + calculateReplyCount(reply),
      0,
    );
  };

  commentMap.forEach((comment) => {
    comment.reply_count = calculateReplyCount(comment);
  });

  return rootComments;
}

export function sortComments(
  comments: Comment[],
  sortBy: SortOption,
): Comment[] {
  const sorted = [...comments];

  switch (sortBy) {
    case "newest":
      sorted.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
      break;
    case "oldest":
      sorted.sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      );
      break;
    case "most_replies":
      sorted.sort((a, b) => (b.reply_count || 0) - (a.reply_count || 0));
      break;
  }

  sorted.forEach((comment) => {
    if (comment.replies && comment.replies.length > 0) {
      comment.replies = sortComments(comment.replies, sortBy);
    }
  });

  return sorted;
}

export function sortReviews(
  reviews: Review[],
  sortBy: ReviewSortOption,
): Review[] {
  const sorted = [...reviews];

  switch (sortBy) {
    case "newest":
      sorted.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
      break;
    case "highest":
      sorted.sort((a, b) => b.rating - a.rating);
      break;
    case "lowest":
      sorted.sort((a, b) => a.rating - b.rating);
      break;
  }

  return sorted;
}

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_LOGO_SIZE = 2 * 1024 * 1024;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_IMAGES_COUNT = 5;

export interface FileValidationError {
  file: string;
  error: string;
}

export function validateLogoFile(file: File): FileValidationError | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      file: file.name,
      error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.',
    };
  }

  if (file.size > MAX_LOGO_SIZE) {
    return {
      file: file.name,
      error: 'File too large. Maximum size is 2MB.',
    };
  }

  return null;
}

export function validateImageFiles(files: File[]): FileValidationError[] {
  const errors: FileValidationError[] = [];

  if (files.length > MAX_IMAGES_COUNT) {
    errors.push({
      file: 'general',
      error: `Too many files. Maximum is ${MAX_IMAGES_COUNT} images.`,
    });
    return errors;
  }

  files.forEach((file) => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      errors.push({
        file: file.name,
        error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.',
      });
    }

    if (file.size > MAX_IMAGE_SIZE) {
      errors.push({
        file: file.name,
        error: 'File too large. Maximum size is 5MB.',
      });
    }
  });

  return errors;
}

export function generateStoragePath(userId: string, filename: string): string {
  const timestamp = Date.now();
  const random = crypto.randomUUID();
  const ext = filename.split('.').pop();
  return `${userId}/${timestamp}-${random}.${ext}`;
}

export function generateProductImagePath(
  userId: string,
  productId: string,
  filename: string
): string {
  const timestamp = Date.now();
  const random = crypto.randomUUID();
  const ext = filename.split('.').pop();
  return `${userId}/${productId}/${timestamp}-${random}.${ext}`;
}
