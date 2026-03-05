import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#EA580C",
          borderRadius: 36,
        }}
      >
        <span
          style={{ fontSize: 110, fontWeight: 900, color: "#fff" }}
        >
          F
        </span>
      </div>
    ),
    { ...size }
  );
}
