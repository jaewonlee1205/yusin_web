import type { MetadataRoute } from "next";
import { products } from "@/data/products";
import { site } from "@/data/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const pages = [
    "",
    "/company",
    "/company/vision",
    "/company/facility",
    "/products",
    "/clients",
    "/videos",
    "/location",
    "/contact",
  ];

  return [
    ...pages.map((path) => ({
      url: `${site.url}${path}/`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.8,
    })),
    ...products.map((p) => ({
      url: `${site.url}/products/${p.slug}/`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
