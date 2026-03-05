-- ==========================================
-- Phase 4 Foundation: admin role, notifications, reviews, OEM policies
-- ==========================================

-- 1. Add admin to user_role enum
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'admin';

-- 2. Add is_active column to users
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true;

-- ==========================================
-- Notifications テーブル
-- ==========================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  link TEXT,
  is_read BOOLEAN NOT NULL DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id) WHERE is_read = false;

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY notifications_select ON notifications FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY notifications_update ON notifications FOR UPDATE
  USING (auth.uid() = user_id);
CREATE POLICY notifications_insert ON notifications FOR INSERT
  WITH CHECK (true);

-- ==========================================
-- Reviews テーブル
-- ==========================================
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reviewee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(project_id, reviewer_id)
);

CREATE INDEX IF NOT EXISTS idx_reviews_reviewee_id ON reviews(reviewee_id);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY reviews_select ON reviews FOR SELECT USING (true);
CREATE POLICY reviews_insert ON reviews FOR INSERT
  WITH CHECK (auth.uid() = reviewer_id);

-- ==========================================
-- Admin RLS Policies
-- ==========================================

-- Admin: 全ユーザー閲覧・更新可
CREATE POLICY users_select_admin ON users FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin')
  );
CREATE POLICY users_update_admin ON users FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin')
  );

-- Admin: 全プロジェクト閲覧可
CREATE POLICY projects_select_admin ON projects FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin')
  );

-- Admin: 全問い合わせ閲覧可
CREATE POLICY inquiries_select_admin ON inquiries FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin')
  );

-- ==========================================
-- OEM追加ポリシー
-- ==========================================

-- OEM: reveal済みプロジェクトを閲覧可
CREATE POLICY projects_select_oem_matched ON projects FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM match_results mr
      JOIN oem_profiles op ON op.id = mr.oem_profile_id
      WHERE mr.project_id = projects.id
      AND op.user_id = auth.uid()
      AND mr.is_revealed = true
    )
  );

-- OEM: match_results内の自分のレコードを閲覧可
CREATE POLICY match_results_select_oem ON match_results FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM oem_profiles op
      WHERE op.id = match_results.oem_profile_id
      AND op.user_id = auth.uid()
    )
  );

-- OEM: recipe_specsをreveal済みプロジェクト分閲覧可
CREATE POLICY recipe_specs_select_oem_revealed ON recipe_specs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM match_results mr
      JOIN oem_profiles op ON op.id = mr.oem_profile_id
      WHERE mr.project_id = recipe_specs.project_id
      AND op.user_id = auth.uid()
      AND mr.is_revealed = true
    )
  );

-- OEM: 問い合わせステータスを更新可（承認/却下）
CREATE POLICY inquiries_update_oem ON inquiries FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM match_results mr
      JOIN oem_profiles op ON op.id = mr.oem_profile_id
      WHERE mr.id = inquiries.match_result_id
      AND op.user_id = auth.uid()
    )
  );

-- ==========================================
-- Supabase Realtime
-- ==========================================
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
