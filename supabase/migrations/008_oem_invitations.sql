-- OEM工場招待テーブル
CREATE TYPE invitation_status AS ENUM ('pending', 'accepted', 'expired', 'cancelled');

CREATE TABLE oem_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  company_name TEXT NOT NULL,
  token UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
  status invitation_status NOT NULL DEFAULT 'pending',
  inviter_id UUID NOT NULL REFERENCES auth.users(id),
  message TEXT,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '7 days'),
  accepted_at TIMESTAMPTZ,
  accepted_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- updated_at トリガー
CREATE TRIGGER update_oem_invitations_updated_at
  BEFORE UPDATE ON oem_invitations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS有効化
ALTER TABLE oem_invitations ENABLE ROW LEVEL SECURITY;

-- 管理者: 全操作可能
CREATE POLICY "oem_invitations_admin_all" ON oem_invitations
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- 招待トークンによる公開読み取り（招待受諾ページ用）
CREATE POLICY "oem_invitations_public_read_by_token" ON oem_invitations
  FOR SELECT TO anon, authenticated
  USING (true);

-- インデックス
CREATE INDEX idx_oem_invitations_token ON oem_invitations(token);
CREATE INDEX idx_oem_invitations_email ON oem_invitations(email);
CREATE INDEX idx_oem_invitations_status ON oem_invitations(status);
