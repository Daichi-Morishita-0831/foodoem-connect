import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://foodoem-connect.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  // 全OEMプロフィールを取得
  const { data: oemProfiles } = await supabase
    .from("oem_profiles")
    .select("id, updated_at");

  const oemEntries: MetadataRoute.Sitemap = (oemProfiles ?? []).map(
    (profile) => ({
      url: `${SITE_URL}/oem/${profile.id}`,
      lastModified: new Date(profile.updated_at ?? Date.now()),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })
  );

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/register`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...oemEntries,
  ];
}
