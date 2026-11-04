import { ImageResponse } from "next/og";

export const alt = "AstroMind: free birth chart calculator for your Sun, Moon and Rising";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const GLYPHS = ["♈", "♋", "♎", "♑", "♌", "♏", "♒", "♉"];

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: "linear-gradient(135deg, #6d4aff 0%, #8f5cff 55%, #ff8a5c 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 36, fontWeight: 700, letterSpacing: -1 }}>AstroMind</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 84, fontWeight: 800, lineHeight: 1.05, letterSpacing: -3, maxWidth: 900 }}>
            Your birth chart, finally decoded
          </div>
          <div style={{ display: "flex", fontSize: 34, marginTop: 24, opacity: 0.9 }}>
            Free Sun, Moon & Rising calculator · Zodiac compatibility
          </div>
        </div>
        <div style={{ display: "flex", gap: 20, fontSize: 44, opacity: 0.85 }}>
          {GLYPHS.map((g) => (
            <span key={g}>{g}</span>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
