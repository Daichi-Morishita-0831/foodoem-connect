import { FileText, Download } from "lucide-react";

export function AttachmentPreview({
  attachments,
  isOwn,
}: {
  attachments: string[];
  isOwn: boolean;
}) {
  if (!attachments || attachments.length === 0) return null;

  return (
    <div className="mt-2 space-y-1.5">
      {attachments.map((url, i) => {
        const isImage = /\.(jpg|jpeg|png|webp|gif)(\?|$)/i.test(url);

        if (isImage) {
          return (
            <a
              key={i}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt="添付画像"
                className="max-h-48 rounded-lg object-cover"
              />
            </a>
          );
        }

        const fileName = url.split("/").pop()?.split("?")[0] ?? "ファイル";

        return (
          <a
            key={i}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 rounded-lg p-2 text-xs ${
              isOwn
                ? "bg-orange-400/30 text-white hover:bg-orange-400/50"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            <FileText className="h-4 w-4 shrink-0" />
            <span className="truncate">{fileName}</span>
            <Download className="ml-auto h-3 w-3 shrink-0" />
          </a>
        );
      })}
    </div>
  );
}
