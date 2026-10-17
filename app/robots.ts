import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/cart", "/checkout", "/account"],
      },
    ],
    sitemap: "https://theonlyretreats.com/sitemap.xml",
  };
}
