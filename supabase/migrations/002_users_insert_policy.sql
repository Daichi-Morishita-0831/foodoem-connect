-- ==========================================
-- 002: Users INSERT Policy
-- ==========================================
-- 登録時に自分のプロフィールを作成できるようにする

CREATE POLICY users_insert ON users FOR INSERT
  WITH CHECK (auth.uid() = id);
