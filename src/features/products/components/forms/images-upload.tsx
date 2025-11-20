"use client";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { validateImageFiles } from "../../helpers";
import { FileDropzone } from "./file-dropzone";

interface ImagesUploadProps {
  value?: File[];
  onChange: (files: File[]) => void;
  existingImages?: string[];
  onExistingImagesChange?: (images: string[]) => void;
  disabled?: boolean;
}

export function ImagesUpload({
  value = [],
  onChange,
  existingImages = [],
  onExistingImagesChange,
  disabled,
}: ImagesUploadProps) {
  const [errors, setErrors] = useState<string[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    if (value.length > 0) {
      const previewPromises = value.map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      });

      Promise.all(previewPromises).then((urls) => {
        setPreviews(urls);
      });
    } else {
      setPreviews([]);
    }
  }, [value]);

  const handleDrop = (newFiles: File[]) => {
    setErrors([]);

    const allFiles = [...value, ...newFiles];
    const totalCount = allFiles.length + existingImages.length;
    
    if (totalCount > 5) {
      setErrors([`You can only have up to 5 images total. Currently have ${existingImages.length} existing and trying to add ${allFiles.length} new ones.`]);
      return;
    }

    const validationErrors = validateImageFiles(allFiles);

    if (validationErrors.length > 0) {
      setErrors(validationErrors.map((e) => e.error));
      return;
    }

    onChange(allFiles);
  };

  const handleRemoveNew = (index: number) => {
    const newFiles = value.filter((_, i) => i !== index);
    onChange(newFiles);
    setErrors([]);
  };

  const handleRemoveExisting = (index: number) => {
    if (onExistingImagesChange) {
      const newExisting = existingImages.filter((_, i) => i !== index);
      onExistingImagesChange(newExisting);
    }
  };

  const totalImages = existingImages.length + value.length;
  const allImages = [
    ...existingImages.map((url, idx) => ({ type: 'existing' as const, url, index: idx })),
    ...previews.map((preview, idx) => ({ type: 'new' as const, url: preview, index: idx })),
  ];

  return (
    <div className="space-y-4">
      {allImages.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {allImages.map((item, displayIndex) => (
            <div
              key={`${item.type}-${item.index}`}
              className="relative aspect-video border rounded overflow-hidden"
            >
              <Image
                src={item.url}
                alt={item.type === 'existing' ? `Existing image ${item.index + 1}` : `Preview ${item.index + 1}`}
                fill
                className="object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-1 right-1 size-6 p-0"
                onClick={() => {
                  if (item.type === 'existing') {
                    handleRemoveExisting(item.index);
                  } else {
                    handleRemoveNew(item.index);
                  }
                }}
                disabled={disabled}
              >
                <X className="h-4 w-4" />
              </Button>
              {item.type === 'existing' && (
                <div className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/50 text-white text-xs rounded">
                  Existing
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {totalImages < 5 && (
        <FileDropzone
          onDrop={handleDrop}
          maxSize={5 * 1024 * 1024}
          maxFiles={5 - totalImages}
          disabled={disabled}
        >
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Drop images here or click to upload
            </p>
            <p className="text-xs text-muted-foreground">
              PNG, JPG, WebP up to 5MB each (max 5 images)
            </p>
            <p className="text-xs text-muted-foreground">
              {totalImages} / 5 images uploaded
            </p>
          </div>
        </FileDropzone>
      )}

      {errors.length > 0 && (
        <div className="space-y-1 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded">
          {errors.map((error, index) => (
            <p key={index} className="text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
