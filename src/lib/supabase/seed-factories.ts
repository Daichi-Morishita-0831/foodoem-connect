/**
 * 工場データシーディングスクリプト
 *
 * 実行方法:
 * SUPABASE_SERVICE_ROLE_KEY=<key> npx tsx src/lib/supabase/seed-factories.ts
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://skscejlsgoyefnawdqhb.supabase.co";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SERVICE_ROLE_KEY) {
  console.error("SUPABASE_SERVICE_ROLE_KEY is required");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// OEM工場のダミーデータ（5社）
const factories = [
  {
    email: "oem1@foodoem-seed.test",
    password: "seed-password-001",
    company_name: "関東フーズ株式会社",
    profile: {
      specialties: ["惣菜", "煮物", "和食"],
      certifications: ["HACCP", "ISO22000"],
      min_lot_size: 500,
      max_lot_size: 50000,
      production_area: "埼玉県川口市",
      delivery_areas: ["東京都", "埼玉県", "千葉県", "神奈川県"],
      description:
        "創業40年の惣菜製造工場。和食を中心に、煮物・焼き物・揚げ物まで幅広く対応。HACCP認証取得済みで、大手コンビニチェーンへの納品実績あり。",
    },
  },
  {
    email: "oem2@foodoem-seed.test",
    password: "seed-password-002",
    company_name: "味の匠フードラボ",
    profile: {
      specialties: ["ソース", "タレ", "ドレッシング"],
      certifications: ["HACCP", "有機JAS"],
      min_lot_size: 200,
      max_lot_size: 20000,
      production_area: "千葉県船橋市",
      delivery_areas: ["東京都", "千葉県", "埼玉県"],
      description:
        "液体調味料専門の製造工場。オリジナルソース・タレの開発から量産まで一貫対応。有機JAS認証取得で、ナチュラル志向の商品開発に強み。",
    },
  },
  {
    email: "oem3@foodoem-seed.test",
    password: "seed-password-003",
    company_name: "北関東冷凍食品センター",
    profile: {
      specialties: ["冷凍食品", "餃子", "中華"],
      certifications: ["HACCP", "FSSC22000"],
      min_lot_size: 1000,
      max_lot_size: 100000,
      production_area: "群馬県太田市",
      delivery_areas: ["関東全域", "東北", "中部"],
      description:
        "冷凍食品に特化した大規模製造工場。急速冷凍ラインを3本保有し、餃子・焼売・春巻きなど中華系冷凍食品のOEMで豊富な実績。",
    },
  },
  {
    email: "oem4@foodoem-seed.test",
    password: "seed-password-004",
    company_name: "パティシエ工房 スウィーツファクトリー",
    profile: {
      specialties: ["スイーツ", "焼き菓子", "洋菓子"],
      certifications: ["HACCP"],
      min_lot_size: 100,
      max_lot_size: 10000,
      production_area: "東京都大田区",
      delivery_areas: ["東京都", "神奈川県"],
      description:
        "パティシエ出身の工場長が率いるスイーツ専門OEM。小ロットから対応可能で、飲食店オリジナルのデザート開発が得意。",
    },
  },
  {
    email: "oem5@foodoem-seed.test",
    password: "seed-password-005",
    company_name: "湘南デリカテッセン",
    profile: {
      specialties: ["弁当", "惣菜", "サラダ"],
      certifications: ["HACCP", "ISO22000", "ハラール"],
      min_lot_size: 300,
      max_lot_size: 30000,
      production_area: "神奈川県相模原市",
      delivery_areas: ["東京都", "神奈川県", "千葉県", "埼玉県"],
      description:
        "弁当・惣菜の受託製造を手がける総合食品工場。ハラール認証取得で、インバウンド需要にも対応。サラダ・カット野菜のラインも保有。",
    },
  },
];

async function seed() {
  console.log("🌱 Seeding OEM factory data...\n");

  for (const factory of factories) {
    // 1. Auth ユーザー作成
    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email: factory.email,
        password: factory.password,
        email_confirm: true,
      });

    if (authError) {
      if (authError.message.includes("already been registered")) {
        console.log(`⏭️  ${factory.company_name} - already exists, skipping`);
        continue;
      }
      console.error(`❌ Auth error for ${factory.company_name}:`, authError.message);
      continue;
    }

    const userId = authData.user.id;
    console.log(`✅ Created auth user: ${factory.email} (${userId})`);

    // 2. users テーブルにプロフィール
    const { error: userError } = await supabase.from("users").insert({
      id: userId,
      role: "oem",
      company_name: factory.company_name,
    });

    if (userError) {
      console.error(`❌ User profile error for ${factory.company_name}:`, userError.message);
      continue;
    }

    // 3. oem_profiles テーブル
    const { error: profileError } = await supabase
      .from("oem_profiles")
      .insert({
        user_id: userId,
        ...factory.profile,
        is_active: true,
      });

    if (profileError) {
      console.error(`❌ OEM profile error for ${factory.company_name}:`, profileError.message);
      continue;
    }

    console.log(`✅ Seeded: ${factory.company_name}`);
  }

  console.log("\n🎉 Seeding complete!");
}

seed().catch(console.error);
