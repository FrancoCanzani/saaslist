"use client";

import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
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
                className="absolute top-1 right-1 h-6 w-6 p-0"
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
            <Upload className="mx-auto h-10 w-10 text-gray-400" />
            <p className="text-sm text-gray-600 dark:text-muted-foreground">
              Drop images here or click to upload
            </p>
            <p className="text-xs text-gray-500">
              PNG, JPG, WebP up to 5MB each (max 5 images)
            </p>
            <p className="text-xs text-gray-500">
              {value.length} / 5 images uploaded
            </p>
          </div>
        </FileDropzone>
      )}

      {errors.length > 0 && (
        <div className="space-y-1">
          {errors.map((error, index) => (
            <p key={index} className="text-sm text-red-500">
              {error}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
