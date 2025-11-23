import { ImageResponse } from "next/og";
import { createClient } from "@/lib/supabase/server";

export const runtime = "edge";
export const alt = "Product on SaasList";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select("name, tagline")
    .eq("id", id)
    .single();

  if (!product) {
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
              fontSize: "48px",
              fontWeight: 500,
              color: "#000000",
            }}
          >
            Product Not Found
          </div>
        </div>
      ),
      {
        ...size,
      }
    );
  }

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
            gap: "24px",
            padding: "80px",
            maxWidth: "1000px",
          }}
        >
          <div
            style={{
              fontSize: "72px",
              fontWeight: 600,
              color: "#000000",
              textAlign: "center",
              lineHeight: "1.1",
              letterSpacing: "-0.02em",
              maxWidth: "900px",
            }}
          >
            {product.name}
          </div>

          {product.tagline && (
            <div
              style={{
                fontSize: "36px",
                fontWeight: 400,
                color: "#666666",
                textAlign: "center",
                lineHeight: "1.3",
                letterSpacing: "-0.01em",
                maxWidth: "850px",
              }}
            >
              {product.tagline}
            </div>
          )}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginTop: "24px",
            }}
          >
            <div
              style={{
                width: "4px",
                height: "4px",
                background: "#ff5b04",
                borderRadius: "50%",
              }}
            />
            <div
              style={{
                fontSize: "20px",
                fontWeight: 500,
                fontFamily: "ui-monospace, 'Courier New', monospace",
                color: "#666666",
                letterSpacing: "-0.01em",
              }}
            >
              SaasList
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

