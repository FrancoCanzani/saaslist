import { Comment } from "./types";

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
