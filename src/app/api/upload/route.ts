import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];
const MAX_SIZE: Record<string, number> = {
  "project-files": 10 * 1024 * 1024, // 10MB
  "message-attachments": 5 * 1024 * 1024, // 5MB
};

export async function POST(request: NextRequest) {
  // レートリミット
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  if (!rateLimit(ip, 20, 60_000)) {
    return NextResponse.json(
      { error: "リクエストが多すぎます" },
      { status: 429 }
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const bucket = formData.get("bucket") as string | null;
  const projectId = formData.get("projectId") as string | null;

  if (!file || !bucket || !projectId) {
    return NextResponse.json(
      { error: "file, bucket, projectId が必要です" },
      { status: 400 }
    );
  }

  if (!MAX_SIZE[bucket]) {
    return NextResponse.json(
      { error: "不正なバケット名です" },
      { status: 400 }
    );
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "対応していないファイル形式です（JPEG, PNG, WebP, PDF）" },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE[bucket]) {
    const maxMB = MAX_SIZE[bucket] / (1024 * 1024);
    return NextResponse.json(
      { error: `ファイルサイズは${maxMB}MB以下にしてください` },
      { status: 400 }
    );
  }

  const ext = file.name.split(".").pop() || "bin";
  const path = `${projectId}/${crypto.randomUUID()}.${ext}`;
  const buffer = await file.arrayBuffer();

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, buffer, { contentType: file.type });

  if (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "アップロードに失敗しました" },
      { status: 500 }
    );
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(path);

  return NextResponse.json({ url: publicUrl });
}
