-- ==========================================
-- Phase 5B: Supabase Storage Buckets
-- ==========================================

-- プロジェクトファイル（仕様書・画像）
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'project-files', 'project-files', true, 10485760,
  ARRAY['image/jpeg','image/png','image/webp','application/pdf']
) ON CONFLICT (id) DO NOTHING;

-- メッセージ添付ファイル（画像のみ）
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'message-attachments', 'message-attachments', true, 5242880,
  ARRAY['image/jpeg','image/png','image/webp']
) ON CONFLICT (id) DO NOTHING;

-- RLS: project-files
CREATE POLICY IF NOT EXISTS storage_project_files_select
  ON storage.objects FOR SELECT
  USING (bucket_id = 'project-files');

CREATE POLICY IF NOT EXISTS storage_project_files_insert
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'project-files' AND auth.uid() IS NOT NULL);

-- RLS: message-attachments
CREATE POLICY IF NOT EXISTS storage_message_attachments_select
  ON storage.objects FOR SELECT
  USING (bucket_id = 'message-attachments');

CREATE POLICY IF NOT EXISTS storage_message_attachments_insert
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'message-attachments' AND auth.uid() IS NOT NULL);
