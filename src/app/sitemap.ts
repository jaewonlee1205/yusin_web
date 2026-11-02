import type { MetadataRoute } from "next";
import { listedProducts } from "@/data/products";
import { site } from "@/data/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const pages = [
    "",
    "/company",
    "/company/vision",
    // 2026-10-19 — "/company/facility" 를 뺐다. 쪽을 지웠다.
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
    /* ⚠️ 판 (113) — `products` 가 아니라 `listedProducts` 다. 숨긴
       진동기의 상세 쪽은 **계속 구워지지만**(그 까닭은 products.ts 의
       HIDDEN_SLUGS 주석) 사이트맵으로 **새로 알리지는 않는다**. */
    ...listedProducts.map((p) => ({
      url: `${site.url}/products/${p.slug}/`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
