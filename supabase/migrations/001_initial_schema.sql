-- ==========================================
-- FoodOEM Connect - Initial Schema
-- ==========================================

-- ENUMs
CREATE TYPE user_role AS ENUM ('restaurant', 'oem');
CREATE TYPE project_status AS ENUM (
  'draft', 'submitted', 'matching', 'negotiation',
  'contracted', 'production', 'completed', 'cancelled'
);
CREATE TYPE inquiry_status AS ENUM ('pending', 'approved', 'rejected');

-- ==========================================
-- Users (Supabase Auth拡張プロフィール)
-- ==========================================
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL,
  company_name TEXT NOT NULL,
  representative_name TEXT,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==========================================
-- OEM Profiles (工場詳細情報)
-- ==========================================
CREATE TABLE oem_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  specialties TEXT[] DEFAULT '{}',
  certifications TEXT[] DEFAULT '{}',
  min_lot_size INT,
  max_lot_size INT,
  production_area TEXT,
  delivery_areas TEXT[] DEFAULT '{}',
  facility_photos TEXT[] DEFAULT '{}',
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==========================================
-- Projects (OEM依頼案件)
-- ==========================================
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  oem_id UUID REFERENCES users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  status project_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==========================================
-- Recipe Specs (構造化レシピデータ)
-- ==========================================
CREATE TABLE recipe_specs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  version INT NOT NULL DEFAULT 1,
  raw_transcript TEXT,
  menu_name TEXT NOT NULL,
  menu_category TEXT,
  main_ingredients JSONB DEFAULT '[]',
  seasoning_direction TEXT,
  target_unit_cost NUMERIC,
  target_selling_price NUMERIC,
  desired_lot_size INT,
  delivery_frequency TEXT,
  allergens TEXT[] DEFAULT '{}',
  process_steps JSONB DEFAULT '[]',
  preservation_method TEXT,
  shelf_life_days INT,
  packaging_type TEXT,
  required_certifications TEXT[] DEFAULT '{}',
  ai_confidence_score NUMERIC,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(project_id, version)
);

-- ==========================================
-- Match Results (マッチング結果)
-- ==========================================
CREATE TABLE match_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  oem_profile_id UUID NOT NULL REFERENCES oem_profiles(id) ON DELETE CASCADE,
  match_score NUMERIC NOT NULL CHECK (match_score >= 0 AND match_score <= 100),
  match_reasons JSONB DEFAULT '[]',
  is_revealed BOOLEAN NOT NULL DEFAULT false,
  revealed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(project_id, oem_profile_id)
);

-- ==========================================
-- Inquiries (問い合わせ)
-- ==========================================
CREATE TABLE inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_result_id UUID NOT NULL REFERENCES match_results(id) ON DELETE CASCADE,
  restaurant_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message TEXT,
  status inquiry_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==========================================
-- Messages (コミュニケーション)
-- ==========================================
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  attachments TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==========================================
-- Indexes
-- ==========================================
CREATE INDEX idx_projects_restaurant_id ON projects(restaurant_id);
CREATE INDEX idx_projects_oem_id ON projects(oem_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_recipe_specs_project_id ON recipe_specs(project_id);
CREATE INDEX idx_match_results_project_id ON match_results(project_id);
CREATE INDEX idx_match_results_oem_profile_id ON match_results(oem_profile_id);
CREATE INDEX idx_inquiries_match_result_id ON inquiries(match_result_id);
CREATE INDEX idx_messages_project_id ON messages(project_id);

-- ==========================================
-- Updated_at trigger
-- ==========================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_users_updated_at
  BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trigger_oem_profiles_updated_at
  BEFORE UPDATE ON oem_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trigger_projects_updated_at
  BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trigger_recipe_specs_updated_at
  BEFORE UPDATE ON recipe_specs FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ==========================================
-- Row Level Security (RLS)
-- ==========================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE oem_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_specs ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Users: 自分のレコードのみ
CREATE POLICY users_select ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY users_update ON users FOR UPDATE USING (auth.uid() = id);

-- OEM Profiles: 全ユーザーが閲覧可、本人のみ更新
CREATE POLICY oem_profiles_select ON oem_profiles FOR SELECT USING (true);
CREATE POLICY oem_profiles_insert ON oem_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY oem_profiles_update ON oem_profiles FOR UPDATE USING (auth.uid() = user_id);

-- Projects: 関係者のみ
CREATE POLICY projects_select ON projects FOR SELECT
  USING (auth.uid() = restaurant_id OR auth.uid() = oem_id);
CREATE POLICY projects_insert ON projects FOR INSERT
  WITH CHECK (auth.uid() = restaurant_id);
CREATE POLICY projects_update ON projects FOR UPDATE
  USING (auth.uid() = restaurant_id OR auth.uid() = oem_id);

-- Recipe Specs: プロジェクト関係者のみ
CREATE POLICY recipe_specs_select ON recipe_specs FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = recipe_specs.project_id
    AND (projects.restaurant_id = auth.uid() OR projects.oem_id = auth.uid())
  ));
CREATE POLICY recipe_specs_insert ON recipe_specs FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = recipe_specs.project_id
    AND projects.restaurant_id = auth.uid()
  ));

-- Match Results: プロジェクト関係者のみ
CREATE POLICY match_results_select ON match_results FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = match_results.project_id
    AND (projects.restaurant_id = auth.uid() OR projects.oem_id = auth.uid())
  ));

-- Inquiries: 関係者のみ
CREATE POLICY inquiries_select ON inquiries FOR SELECT
  USING (auth.uid() = restaurant_id OR EXISTS (
    SELECT 1 FROM match_results mr
    JOIN oem_profiles op ON op.id = mr.oem_profile_id
    WHERE mr.id = inquiries.match_result_id
    AND op.user_id = auth.uid()
  ));
CREATE POLICY inquiries_insert ON inquiries FOR INSERT
  WITH CHECK (auth.uid() = restaurant_id);

-- Messages: プロジェクト関係者のみ
CREATE POLICY messages_select ON messages FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = messages.project_id
    AND (projects.restaurant_id = auth.uid() OR projects.oem_id = auth.uid())
  ));
CREATE POLICY messages_insert ON messages FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = messages.project_id
    AND (projects.restaurant_id = auth.uid() OR projects.oem_id = auth.uid())
  ));
