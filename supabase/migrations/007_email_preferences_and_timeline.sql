-- =====================================================
-- Migration 007: メール通知設定 + 案件タイムライン
-- =====================================================

-- 1. users テーブルにメール通知設定カラム追加
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS email_notification_enabled boolean DEFAULT true;

-- 2. project_events テーブル（案件タイムライン）
CREATE TABLE IF NOT EXISTS project_events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  actor_id uuid REFERENCES users(id) ON DELETE SET NULL,
  old_value text,
  new_value text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_project_events_project_id
  ON project_events(project_id);
CREATE INDEX IF NOT EXISTS idx_project_events_created_at
  ON project_events(created_at);

-- RLS有効化
ALTER TABLE project_events ENABLE ROW LEVEL SECURITY;

-- RLSポリシー: 案件の関係者のみ閲覧可能
CREATE POLICY "project_events_select_policy"
  ON project_events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = project_events.project_id
        AND (p.restaurant_id = auth.uid() OR p.oem_id = auth.uid())
    )
    OR
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  );

-- RLSポリシー: サーバーサイド（service_role）からの挿入を許可
CREATE POLICY "project_events_insert_policy"
  ON project_events FOR INSERT
  WITH CHECK (true);

-- Realtime有効化
ALTER PUBLICATION supabase_realtime ADD TABLE project_events;
