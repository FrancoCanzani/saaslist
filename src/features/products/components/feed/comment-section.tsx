"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { parseAsStringLiteral, useQueryState } from "nuqs";
import { useMemo } from "react";
import { buildCommentTree, sortComments } from "../../helpers";
import { Comment, SortOption } from "../../types";
import CommentForm from "./comment-form";
import CommentList from "./comment-list";

interface CommentSectionProps {
  productId: string;
  initialComments: Comment[];
  currentUserId?: string;
  commentsCount: number;
}

const sortOptions: Record<SortOption, string> = {
  newest: "Newest",
  oldest: "Oldest",
  most_replies: "Most Replies",
};

export default function CommentSection({
  productId,
  initialComments,
  currentUserId,
  commentsCount: initialCount,
}: CommentSectionProps) {
  const [sortBy, setSortBy] = useQueryState(
    "sort",
    parseAsStringLiteral(["newest", "oldest", "most_replies"]).withDefault(
      "newest",
    ),
  );
  const router = useRouter();

  const handleCommentSuccess = () => {
    router.refresh();
  };

  const commentTree = useMemo(() => {
    const tree = buildCommentTree(initialComments);
    return sortComments(tree, sortBy);
  }, [initialComments, sortBy]);

  return (
    <div className="py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-medium flex items-center gap-2">
          Comments ({initialComments.length})
        </h2>

        <Select
          value={sortBy}
          onValueChange={(value) => setSortBy(value as SortOption)}
        >
          <SelectTrigger size="xs" className="text-xs">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {(Object.entries(sortOptions) as [SortOption, string][]).map(
              ([value, label]) => (
                <SelectItem key={value} value={value} className="text-xs">
                  {label}
                </SelectItem>
              ),
            )}
          </SelectContent>
        </Select>
      </div>

      {currentUserId ? (
        <div className="mb-8">
          <CommentForm productId={productId} onSuccess={handleCommentSuccess} />
        </div>
      ) : (
        <Alert>
          <AlertDescription className="mx-auto">
            Please log in to comment
          </AlertDescription>
        </Alert>
      )}

      {commentTree.length > 0 ? (
        <CommentList
          comments={commentTree}
          currentUserId={currentUserId}
          productId={productId}
        />
      ) : (
        <Alert>
          <AlertDescription className="mx-auto">
            No comments yet. Be the first to share your thoughts!
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
