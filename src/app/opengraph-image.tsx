import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "saaslist - A curated directory of bootstrapped SaaS tools";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  const fontData = await fetch(
    "https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@500&display=swap",
  ).then((res) => res.text());

  const fontUrl = fontData.match(/src: url\(([^)]+)\)/)?.[1];

  let font: ArrayBuffer | null = null;
  if (fontUrl) {
    font = await fetch(fontUrl).then((res) => res.arrayBuffer());
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-end",
          backgroundColor: "#000000",
          padding: "64px",
        }}
      >
        <div
          style={{
            fontFamily: font ? "Crimson Pro" : "Georgia, serif",
            fontSize: "140px",
            fontWeight: 500,
            color: "#ffffff",
            letterSpacing: "-0.02em",
          }}
        >
          SaasList
        </div>
      </div>
    ),
    {
      ...size,
      fonts: font
        ? [
            {
              name: "Crimson Pro",
              data: font,
              style: "normal",
              weight: 500,
            },
          ]
        : undefined,
    },
  );
}
