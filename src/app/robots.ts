import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {

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
        ],
      },
    ],
  };
}
