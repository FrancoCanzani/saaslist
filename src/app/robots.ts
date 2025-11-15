import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/auth/",
          "/login",
          "/logout",
          "/profile",
          "/my-products",
          "/products/new",
          "/products/*/success",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

