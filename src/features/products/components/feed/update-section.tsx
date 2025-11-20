"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRouter } from "next/navigation";
import { Update } from "../../types";
import { UpdateForm } from "./update-form";
import { UpdateItem } from "./update-item";

interface UpdateSectionProps {
  productId: string;
  initialUpdates: Update[];
  isOwner: boolean;
}

export function UpdateSection({
  productId,
  initialUpdates,
  isOwner,
}: UpdateSectionProps) {
  const router = useRouter();

  const handleSuccess = () => {
    router.refresh();
  };

  return (
    <div className="py-8">
      {isOwner && (
        <div className="mb-8">
          <h3 className="font-medium mb-4 capitalize">
            Share your product changelog
          </h3>
          <UpdateForm productId={productId} onSuccess={handleSuccess} />
        </div>
      )}

      {initialUpdates.length > 0 ? (
        <div>
          {initialUpdates.map((update) => (
            <UpdateItem
              key={update.id}
              update={update}
              isOwner={isOwner}
              productId={productId}
            />
          ))}
        </div>
      ) : (
        <Alert>
          <AlertDescription className="mx-auto">
            No updates yet.
            {isOwner && " Share what's new with your users!"}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
