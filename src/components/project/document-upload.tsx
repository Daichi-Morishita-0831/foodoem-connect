"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUpload } from "@/components/ui/file-upload";
import { FileText, Paperclip } from "lucide-react";

export function DocumentUpload({ projectId }: { projectId: string }) {
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<{ name: string; url: string }[]>([]);
  const [error, setError] = useState("");

  const handleUpload = async (file: File) => {
    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("bucket", "project-files");
      formData.append("projectId", projectId);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error || "アップロードに失敗しました");
        return;
      }

      setFiles((prev) => [...prev, { name: file.name, url: data.url }]);
    } catch {
      setError("アップロードに失敗しました");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Paperclip className="h-4 w-4 text-orange-600" />
          ドキュメント
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {files.length > 0 && (
          <div className="space-y-2">
            {files.map((f, i) => (
              <a
                key={i}
                href={f.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg border p-3 text-sm hover:bg-gray-50"
              >
                <FileText className="h-4 w-4 text-gray-400" />
                <span className="truncate text-gray-700">{f.name}</span>
              </a>
            ))}
          </div>
        )}

        <FileUpload
          accept="image/*,.pdf"
          maxSizeMB={10}
          onUpload={handleUpload}
          uploading={uploading}
        />

        {error && <p className="text-sm text-red-500">{error}</p>}
      </CardContent>
    </Card>
  );
}
