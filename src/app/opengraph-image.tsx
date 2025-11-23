import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "SaasList - Discover & Share SaaS Products";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#ffffff",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "32px",
            padding: "80px",
            maxWidth: "900px",
          }}
        >
          {/* Brand */}
          <div
            style={{
              fontSize: "72px",
              fontWeight: 500,
              fontFamily: "ui-monospace, 'Courier New', monospace",
              color: "#000000",
              letterSpacing: "-0.02em",
            }}
          >
            SaasList
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: "48px",
              fontWeight: 300,
              color: "#1a1a1a",
              textAlign: "center",
              lineHeight: "1.2",
              letterSpacing: "-0.02em",
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}
          >
            Get Noticed. Get Users. Get Results.
          </div>

          {/* Accent line */}
          <div
            style={{
              width: "120px",
              height: "2px",
              background: "#ff5b04",
              marginTop: "8px",
            }}
          />
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
