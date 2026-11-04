import { ImageResponse } from "next/og";

export const alt = "AstroMind: free birth chart calculator for your Sun, Moon and Rising";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Parlour palette (see app/globals.css). ImageResponse can't read CSS variables or load the
// site fonts without a network fetch, so it uses its default font and draws shapes, not symbols.
const PARCHMENT = "#f3e6c8";
const INK = "#1c1410";
const OXBLOOD = "#8b1e1e";
const GOLD = "#d9a521";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          padding: 28,
          background: PARCHMENT,
          fontFamily: "sans-serif",
          color: INK,
        }}
      >
        {/* Tarot-style double frame */}
        <div style={{ display: "flex", flex: 1, border: `6px solid ${INK}`, padding: 10 }}>
          <div
            style={{
              display: "flex",
              flex: 1,
              flexDirection: "column",
              justifyContent: "space-between",
              border: `2px solid ${INK}`,
              padding: "36px 52px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 30, fontWeight: 800, letterSpacing: 4 }}>
              <span>ASTROMIND</span>
              <span style={{ color: OXBLOOD }}>ADMIT ONE · FREE</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", fontSize: 92, fontWeight: 900, lineHeight: 1.1, letterSpacing: -2, color: OXBLOOD }}>
                Let the stars
              </div>
              <div style={{ display: "flex" }}>
                <div style={{ display: "flex", fontSize: 92, fontWeight: 900, lineHeight: 1.1, letterSpacing: -2, background: GOLD, padding: "0 20px", color: INK }}>
                  spill the tea
                </div>
              </div>
              <div style={{ display: "flex", fontSize: 32, marginTop: 28, fontWeight: 500 }}>
                Free Sun, Moon & Rising calculator · Zodiac compatibility
              </div>
            </div>

            {/* Ornament drawn from shapes: the default image font has no symbol glyphs. */}
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <div style={{ display: "flex", flex: 1, height: 3, background: INK }} />
              <div style={{ display: "flex", width: 22, height: 22, background: GOLD, border: `3px solid ${INK}`, transform: "rotate(45deg)" }} />
              <div style={{ display: "flex", flex: 1, height: 3, background: INK }} />
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
