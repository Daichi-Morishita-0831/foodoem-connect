import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "FoodOEM Connect - 飲食店とOEM工場をつなぐ";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
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
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "#EA580C",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "24px",
              fontWeight: "bold",
            }}
          >
            F
          </div>
          <span style={{ fontSize: "36px", fontWeight: "bold", color: "#111827" }}>
            FoodOEM{" "}
            <span style={{ color: "#EA580C" }}>Connect</span>
          </span>
        </div>
        <p
          style={{
            fontSize: "28px",
            color: "#374151",
            textAlign: "center",
            maxWidth: "800px",
          }}
        >
          飲食店とOEM工場をつなぐ
        </p>
        <p
          style={{
            fontSize: "20px",
            color: "#6B7280",
            textAlign: "center",
            marginTop: "8px",
          }}
        >
          音声AIで最適な食品OEM工場が見つかるマッチングプラットフォーム
        </p>
      </div>
    ),
    { ...size }
  );
}
