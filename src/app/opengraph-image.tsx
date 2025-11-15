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
          background: "linear-gradient(135deg, #FAFAFA 0%, #ffffff 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(circle at top center, rgba(255, 91, 4, 0.15), transparent 60%)",
            opacity: 0.8,
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "24px",
            padding: "80px",
            zIndex: 1,
          }}
        >
          {/* Logo/Brand */}
          <div
            style={{
              fontSize: "80px",
              fontWeight: 600,
              fontFamily: "ui-monospace, 'Courier New', monospace",
              color: "#000000",
              letterSpacing: "-0.02em",
              marginBottom: "16px",
            }}
          >
            SaasList
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: "52px",
              fontWeight: 500,
              color: "#1a1a1a",
              textAlign: "center",
              maxWidth: "1000px",
              lineHeight: "1.15",
              letterSpacing: "-0.02em",
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}
          >
            Get Noticed. Get Users. Get Results.
          </div>

          <div
            style={{
              fontSize: "26px",
              color: "#666666",
              textAlign: "center",
              maxWidth: "850px",
              lineHeight: "1.5",
              marginTop: "24px",
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}
          >
            Discover, share, and upvote the best SaaS tools.
          </div>

          <div
            style={{
              width: "140px",
              height: "5px",
              background: "#ff5b04",
              marginTop: "40px",
              borderRadius: "3px",
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
