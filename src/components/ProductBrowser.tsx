"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";
import { CATEGORIES, products, type ProductCategory } from "@/data/products";

type Filter = "전체" | ProductCategory;

const FILTERS: Filter[] = ["전체", ...CATEGORIES];

export default function ProductBrowser() {
  const [filter, setFilter] = useState<Filter>("전체");

  const visible =
    filter === "전체" ? products : products.filter((p) => p.category === filter);

  return (
    <>
      <div
        role="tablist"
        aria-label="제품 분류"
        className="-mx-5 mb-10 flex gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:flex-wrap sm:px-0"
      >
        {FILTERS.map((f) => {
          const active = f === filter;
          const count =
            f === "전체"
              ? products.length
              : products.filter((p) => p.category === f).length;

          return (
            <button
              key={f}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setFilter(f)}
              className={`shrink-0 rounded-full border px-5 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "border-navy bg-navy text-white"
                  : "border-line bg-white text-ink-soft hover:border-navy/40 hover:text-ink"
              }`}
            >
              {f}
              <span
                className={`ml-1.5 text-xs tabular-nums ${
                  active ? "text-white/60" : "text-muted"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </>
  );
}
