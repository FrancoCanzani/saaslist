"use client";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { validateLogoFile } from "../../helpers";
import { FileDropzone } from "./file-dropzone";

interface LogoUploadProps {
  value?: File | null;
  onChange: (file: File | null) => void;
  existingLogoUrl?: string;
  onExistingLogoRemove?: () => void;
  disabled?: boolean;
}

export function LogoUpload({
  value,
  onChange,
  existingLogoUrl,
  onExistingLogoRemove,
  disabled,
}: LogoUploadProps) {
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (value) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(value);
    } else if (existingLogoUrl && !value) {
      setPreview(existingLogoUrl);
    } else {
      setPreview(null);
    }
  }, [value, existingLogoUrl]);

  const handleDrop = (files: File[]) => {
    setError(null);
    const file = files[0];

    if (!file) return;

    const validationError = validateLogoFile(file);
    if (validationError) {
      setError(validationError.error);
      return;
    }

    onChange(file);
  };

  const handleRemove = () => {
    setPreview(null);
    setError(null);
    onChange(null);
    if (existingLogoUrl && onExistingLogoRemove) {
      onExistingLogoRemove();
    }
  };

  if (preview) {
    const isExisting = existingLogoUrl && !value && preview === existingLogoUrl;

    return (
      <div className="space-y-2">
        <div className="relative w-32 h-32 border rounded overflow-hidden">
          <Image
            src={preview}
            alt="Logo preview"
            fill
            className="object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            size="xs"
            className="absolute top-1 right-1 size-6 p-0"
            onClick={handleRemove}
            disabled={disabled}
          >
            <X className="h-4 w-4" />
          </Button>
          {isExisting && (
            <div className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/50 text-white text-xs rounded">
              Existing
            </div>
          )}
        </div>
        {isExisting && (
          <p className="text-xs text-muted-foreground">
            Click X to remove existing logo
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <FileDropzone
        onDrop={handleDrop}
        maxSize={5 * 1024 * 1024}
        maxFiles={1}
        disabled={disabled}
      >
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Drop logo here or click to upload
          </p>
          <p className="text-xs text-muted-foreground">
            PNG, JPG, WebP up to 5MB
          </p>
        </div>
      </FileDropzone>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
