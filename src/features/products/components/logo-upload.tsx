"use client";

import { useState } from "react";
import { FileDropzone } from "./file-dropzone";
import { validateLogoFile } from "../helpers";
import { X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface LogoUploadProps {
  value?: File | null;
  onChange: (file: File | null) => void;
  disabled?: boolean;
}

export function LogoUpload({ value, onChange, disabled }: LogoUploadProps) {
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleDrop = (files: File[]) => {
    setError(null);
    const file = files[0];

    if (!file) return;

    const validationError = validateLogoFile(file);
    if (validationError) {
      setError(validationError.error);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    onChange(file);
  };

  const handleRemove = () => {
    setPreview(null);
    setError(null);
    onChange(null);
  };

  if (preview) {
    return (
      <div className="space-y-2">
        <div className="relative w-32 h-32 border rounded-lg overflow-hidden">
          <Image
            src={preview}
            alt="Logo preview"
            fill
            className="object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-1 right-1 h-6 w-6 p-0"
            onClick={handleRemove}
            disabled={disabled}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <FileDropzone
        onDrop={handleDrop}
        maxSize={2 * 1024 * 1024}
        maxFiles={1}
        disabled={disabled}
      >
        <div className="space-y-2">
          <Upload className="mx-auto h-10 w-10 text-gray-400" />
          <p className="text-sm text-gray-600">
            Drop logo here or click to upload
          </p>
          <p className="text-xs text-gray-500">PNG, JPG, WebP up to 2MB</p>
        </div>
      </FileDropzone>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

