"use client";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { validateImageFiles } from "../helpers";
import { FileDropzone } from "./file-dropzone";

interface ImagesUploadProps {
  value?: File[];
  onChange: (files: File[]) => void;
  disabled?: boolean;
}

export function ImagesUpload({
  value = [],
  onChange,
  disabled,
}: ImagesUploadProps) {
  const [errors, setErrors] = useState<string[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleDrop = (newFiles: File[]) => {
    setErrors([]);

    const allFiles = [...value, ...newFiles];
    const validationErrors = validateImageFiles(allFiles);

    if (validationErrors.length > 0) {
      setErrors(validationErrors.map((e) => e.error));
      return;
    }

    const newPreviews = newFiles.map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(newPreviews).then((urls) => {
      setPreviews([...previews, ...urls]);
    });

    onChange(allFiles);
  };

  const handleRemove = (index: number) => {
    const newFiles = value.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setPreviews(newPreviews);
    onChange(newFiles);
    setErrors([]);
  };

  return (
    <div className="space-y-4">
      {previews.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {previews.map((preview, index) => (
            <div
              key={index}
              className="relative aspect-video border rounded overflow-hidden"
            >
              <Image
                src={preview}
                alt={`Preview ${index + 1}`}
                fill
                className="object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-1 right-1 size-6 p-0"
                onClick={() => handleRemove(index)}
                disabled={disabled}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {value.length < 5 && (
        <FileDropzone
          onDrop={handleDrop}
          maxSize={5 * 1024 * 1024}
          maxFiles={5 - value.length}
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
              {value.length} / 5 images uploaded
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
