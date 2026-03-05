"use client";

import { useRef, useState, useCallback } from "react";
import { Upload, X, FileText, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
  accept?: string;
  maxSizeMB?: number;
  onUpload: (file: File) => Promise<void>;
  uploading?: boolean;
}

export function FileUpload({
  accept = "image/*,.pdf",
  maxSizeMB = 10,
  onUpload,
  uploading = false,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState<{
    name: string;
    size: string;
    type: string;
    url?: string;
  } | null>(null);
  const [error, setError] = useState("");

  const maxBytes = maxSizeMB * 1024 * 1024;

  const handleFile = useCallback(
    async (file: File) => {
      setError("");
      setPreview(null);

      if (file.size > maxBytes) {
        setError(`ファイルサイズは${maxSizeMB}MB以下にしてください`);
        return;
      }

      const sizeStr =
        file.size < 1024 * 1024
          ? `${(file.size / 1024).toFixed(0)}KB`
          : `${(file.size / (1024 * 1024)).toFixed(1)}MB`;

      const previewData: typeof preview = {
        name: file.name,
        size: sizeStr,
        type: file.type,
      };

      if (file.type.startsWith("image/")) {
        previewData.url = URL.createObjectURL(file);
      }

      setPreview(previewData);
      await onUpload(file);
      setPreview(null);
    },
    [maxBytes, maxSizeMB, onUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div>
      <div
        className={`relative rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
          dragOver
            ? "border-orange-400 bg-orange-50"
            : "border-gray-200 hover:border-gray-300"
        } ${uploading ? "pointer-events-none opacity-50" : "cursor-pointer"}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
        />
        {preview ? (
          <div className="flex items-center justify-center gap-3">
            {preview.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={preview.url}
                alt={preview.name}
                className="h-16 w-16 rounded object-cover"
              />
            ) : (
              <FileText className="h-10 w-10 text-gray-400" />
            )}
            <div className="text-left">
              <p className="text-sm font-medium text-gray-700">
                {preview.name}
              </p>
              <p className="text-xs text-gray-500">{preview.size}</p>
            </div>
            {uploading && (
              <div className="ml-2 h-5 w-5 animate-spin rounded-full border-2 border-orange-600 border-t-transparent" />
            )}
          </div>
        ) : (
          <div>
            <Upload className="mx-auto h-8 w-8 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              ファイルをドラッグ&ドロップ、またはクリックして選択
            </p>
            <p className="mt-1 text-xs text-gray-400">
              最大{maxSizeMB}MB（画像・PDF対応）
            </p>
          </div>
        )}
      </div>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}
