-- ==========================================
-- 003: Inquiry Reveal Function
-- ==========================================

-- match_results の UPDATE ポリシー（飲食店が is_revealed を更新可能に）
CREATE POLICY match_results_update ON match_results FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = match_results.project_id
    AND projects.restaurant_id = auth.uid()
  ));

-- submit_inquiry: 問い合わせ作成 + 開示を原子的に実行
CREATE OR REPLACE FUNCTION submit_inquiry(
  p_match_result_id UUID,
  p_message TEXT DEFAULT ''
) RETURNS UUID AS $$
DECLARE
  v_restaurant_id UUID;
  v_inquiry_id UUID;
BEGIN
  -- 呼び出し元ユーザーを取得
  v_restaurant_id := auth.uid();
  IF v_restaurant_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- match_result が存在し、関連プロジェクトの飲食店であることを確認
  IF NOT EXISTS (
    SELECT 1 FROM match_results mr
    JOIN projects p ON p.id = mr.project_id
    WHERE mr.id = p_match_result_id
    AND p.restaurant_id = v_restaurant_id
  ) THEN
    RAISE EXCEPTION 'Unauthorized or match result not found';
  END IF;

  -- 重複チェック
  IF EXISTS (
    SELECT 1 FROM inquiries
    WHERE match_result_id = p_match_result_id
    AND restaurant_id = v_restaurant_id
  ) THEN
    RAISE EXCEPTION 'Inquiry already submitted';
  END IF;

  -- inquiries にレコード作成
  INSERT INTO inquiries (match_result_id, restaurant_id, message)
  VALUES (p_match_result_id, v_restaurant_id, p_message)
  RETURNING id INTO v_inquiry_id;

  -- match_results の is_revealed を true に更新
  UPDATE match_results
  SET is_revealed = true, revealed_at = now()
  WHERE id = p_match_result_id;

  RETURN v_inquiry_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
