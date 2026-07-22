import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard/", "/cbt/"],
    },
    sitemap: "https://smartmed-cbt.com/sitemap.xml",
  };
}
