"use client";

import { cn } from "@/lib/utils";
import { Upload } from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

interface FileDropzoneProps {
  onDrop: (acceptedFiles: File[]) => void;
  accept?: Record<string, string[]>;
  maxSize?: number;
  maxFiles?: number;
  disabled?: boolean;
  children?: React.ReactNode;
}

export function FileDropzone({
  onDrop,
  accept = { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
  maxSize = 5 * 1024 * 1024,
  maxFiles = 1,
  disabled = false,
  children,
}: FileDropzoneProps) {
  const [dropError, setDropError] = useState<string | null>(null);

  const handleDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      setDropError(null);
      
      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0];
        const file = rejection.file;
        const extension = file.name.split('.').pop()?.toUpperCase() || 'unknown';
        
        if (rejection.errors[0]?.code === 'file-invalid-type') {
          setDropError(`"${file.name}" is not a valid image (${extension}). Please drop an image file (JPEG, PNG, or WebP).`);
        } else if (rejection.errors[0]?.code === 'file-too-large') {
          const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
          setDropError(`"${file.name}" is too large (${sizeMB}MB). Please use a smaller file.`);
        } else {
          setDropError(`"${file.name}" could not be uploaded.`);
        }
        return;
      }
      
      onDrop(acceptedFiles);
    },
    [onDrop],
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop: handleDrop,
    accept,
    maxSize,
    maxFiles,
    disabled,
  });

  return (
    <div className="space-y-2">
      <div
        {...getRootProps()}
        className={cn(
          "border border-dashed rounded p-8 text-center cursor-pointer transition-colors",
          isDragActive && !isDragReject
            ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
            : isDragReject
              ? "border-red-500 bg-red-50 dark:bg-red-950/20"
              : "border-gray-300 hover:border-gray-400",
          disabled && "opacity-50 cursor-not-allowed",
        )}
      >
        <input {...getInputProps()} />
        {children || (
          <div className="space-y-2">
            <Upload className={cn(
              "mx-auto h-10 w-10",
              isDragReject ? "text-red-400" : "text-gray-400"
            )} />
            <p className="text-sm text-gray-600 dark:text-muted-foreground">
              {isDragReject
                ? "This file type is not supported"
                : isDragActive
                  ? "Drop the files here..."
                  : "Drag & drop files here, or click to select"}
            </p>
          </div>
        )}
      </div>
      {dropError && (
          <p className="text-sm text-red-600 dark:text-red-400">{dropError}</p>
      )}
    </div>
  );
}
