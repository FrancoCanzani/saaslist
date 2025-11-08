"use client";

import { cn } from "@/lib/utils";
import { Upload } from "lucide-react";
import { useCallback } from "react";
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
  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      onDrop(acceptedFiles);
    },
    [onDrop],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept,
    maxSize,
    maxFiles,
    disabled,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed rounded p-8 text-center cursor-pointer transition-colors",
        isDragActive
          ? "border-blue-500 bg-blue-50"
          : "border-gray-300 hover:border-gray-400",
        disabled && "opacity-50 cursor-not-allowed",
      )}
    >
      <input {...getInputProps()} />
      {children || (
        <div className="space-y-2">
          <Upload className="mx-auto h-10 w-10 text-gray-400" />
          <p className="text-sm text-gray-600 dark:text-muted-foreground">
            {isDragActive
              ? "Drop the files here..."
              : "Drag & drop files here, or click to select"}
          </p>
        </div>
      )}
    </div>
  );
}
