import { ImageResponse } from "next/og";
import { getPublicOemProfile } from "@/lib/supabase/queries/public-oem";

export const runtime = "edge";
export const alt = "OEM工場プロフィール | FoodOEM Connect";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OemOgImage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getPublicOemProfile(id);

  const companyName = data?.companyName ?? "OEM工場";
  const specialties = (data?.profile.specialties as string[]) ?? [];
  const rating = data?.averageRating ?? 0;
  const reviewCount = data?.reviewCount ?? 0;

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #FFF7ED 0%, #FFFFFF 50%, #FFFBEB 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          padding: "60px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "32px",
            fontSize: "18px",
            color: "#6B7280",
          }}
        >
          <span style={{ color: "#EA580C", fontWeight: "bold" }}>FoodOEM Connect</span>
        </div>

        <h1
          style={{
            fontSize: "48px",
            fontWeight: "bold",
            color: "#111827",
            textAlign: "center",
            marginBottom: "16px",
          }}
        >
          {companyName}
        </h1>

        {specialties.length > 0 && (
          <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
            {specialties.slice(0, 4).map((s) => (
              <span
                key={s}
                style={{
                  background: "#FFF7ED",
                  border: "1px solid #FDBA74",
                  borderRadius: "16px",
                  padding: "6px 16px",
                  fontSize: "16px",
                  color: "#C2410C",
                }}
              >
                {s}
              </span>
            ))}
          </div>
        )}

        {reviewCount > 0 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "20px",
              color: "#F59E0B",
            }}
          >
            {"★".repeat(Math.round(rating))}
            <span style={{ color: "#6B7280", marginLeft: "8px" }}>
              {rating} ({reviewCount}件のレビュー)
            </span>
          </div>
        )}
      </div>
    ),
    { ...size }
  );
}
