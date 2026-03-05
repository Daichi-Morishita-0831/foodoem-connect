-- ==========================================
-- Phase 5C: OEM公開プロフィール用ポリシー
-- ==========================================

-- OEMユーザーの公開情報を匿名アクセス可能にする
CREATE POLICY IF NOT EXISTS users_select_oem_public ON users FOR SELECT
  USING (role = 'oem');
