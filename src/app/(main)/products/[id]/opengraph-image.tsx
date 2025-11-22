import { ImageResponse } from "next/og";
import { createClient } from "@/lib/supabase/server";

export const runtime = "edge";
export const alt = "Product on SaasList";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

async function loadGoogleFont(font: string, text: string) {
  const url = `https://fonts.googleapis.com/css2?family=${font}&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(url)).text();
  const resource = css.match(/src: url\((.+)\) format\('(opentype|truetype)'\)/);

  if (resource) {
    const response = await fetch(resource[1]);
    if (response.status == 200) {
      return await response.arrayBuffer();
    }
  }

  throw new Error("failed to load font data");
}

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select("name, tagline, logo_url")
    .eq("id", id)
    .single();

  let crimsonProFont: ArrayBuffer | null = null;
  let interFont: ArrayBuffer | null = null;

  try {
    crimsonProFont = await loadGoogleFont("Crimson+Pro", "SaasList");
  } catch (error) {
    console.error("Failed to load Crimson Pro font:", error);
  }

  if (product) {
    try {
      interFont = await loadGoogleFont("Inter:wght@400;500;700", `${product.name} ${product.tagline}`);
    } catch (error) {
      console.error("Failed to load Inter font:", error);
    }
  }

  const fonts: Array<{ name: string; data: ArrayBuffer; style: "normal" }> = [];
  if (crimsonProFont) {
    fonts.push({
      name: "Crimson Pro",
      data: crimsonProFont,
      style: "normal" as const,
    });
  }
  if (interFont) {
    fonts.push({
      name: "Inter",
      data: interFont,
      style: "normal" as const,
    });
  }

  if (!product) {
    return new ImageResponse(
      (
        <div tw="bg-gradient-to-br from-gray-50 to-white w-full h-full flex flex-col items-center justify-center">
          <div tw="text-6xl font-semibold text-black">Product Not Found</div>
        </div>
      ),
      {
        ...size,
        fonts: fonts.length > 0 ? fonts : undefined,
      }
    );
  }

  return new ImageResponse(
    (
      <div tw="bg-red-50 w-full h-full flex flex-col items-center justify-center relative">
        <div tw="absolute top-0 left-0 right-0 bottom-0 opacity-80"/>
        <div tw="flex flex-col items-center justify-center gap-8 p-20 z-10 max-w-[1000px]">
          {product.logo_url && (
            <div tw="flex items-center justify-center mb-4">
              <img
                src={product.logo_url}
                alt={product.name}
                width="120"
                height="120"
                tw="rounded-2xl object-contain"
              />
            </div>
          )}

          <div tw="text-7xl font-bold text-black text-center leading-tight tracking-tight mb-2" style={{ fontFamily: "Inter" }}>
            {product.name}
          </div>

          <div tw="text-4xl font-medium text-gray-900 text-center leading-snug tracking-tight max-w-[900px]" style={{ fontFamily: "Inter" }}>
            {product.tagline}
          </div>

          <div tw="flex items-center gap-3 mt-8 text-2xl text-gray-600">
            <div tw="w-1 h-1 bg-[#ff5b04] rounded-full" />
            <span tw="font-mono" style={{ fontFamily: "Crimson Pro" }}>SaasList</span>
          </div>

          <div tw="w-[140px] h-1 bg-[#ff5b04] mt-6 rounded-sm" />
        </div>
      </div>
    ),
    {
      ...size,
      fonts: fonts.length > 0 ? fonts : undefined,
    }
  );
}

