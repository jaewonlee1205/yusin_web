import Image from "next/image";
import Link from "next/link";
import { products } from "@/data/products";
import type { NavChild } from "@/data/site";

/**
 * 드롭다운 안쪽. 두 가지 모양을 그린다.
 *  - "products" : 제품 썸네일 패널. products.ts를 직접 읽으므로 제품을 추가하면
 *                 메뉴도 따라 늘어난다.
 *  - "list"     : 라벨 + 한 줄 설명 목록.
 */

export function ProductPanel({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="p-4 sm:p-5">
      <ul className="grid gap-1 sm:grid-cols-2">
        {products.map((product) => (
          <li key={product.slug}>
            <Link
              href={`/products/${product.slug}`}
              onClick={onNavigate}
              className="group/item flex items-center gap-3 rounded-md p-2.5 transition-colors hover:bg-surface"
            >
              <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded bg-surface">
                <Image
                  src={product.images[0].src}
                  alt=""
                  fill
                  sizes="48px"
                  className="object-contain p-1"
                />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-bold text-ink group-hover/item:text-brand">
                  {product.name}
                </span>
                <span className="block truncate text-xs text-muted">
                  {product.nameEn}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <Link
        href="/products"
        onClick={onNavigate}
        className="mt-2 flex items-center justify-between rounded-md border-t border-line px-2.5 pb-1 pt-3.5 text-sm font-semibold text-navy transition-colors hover:text-brand"
      >
        제품 전체 보기
        <Arrow />
      </Link>
    </div>
  );
}

export function ListPanel({
  items,
  onNavigate,
}: {
  items: NavChild[];
  onNavigate?: () => void;
}) {
  return (
    <ul className="p-2">
      {items.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            onClick={onNavigate}
            className="group/item block rounded-md p-3 transition-colors hover:bg-surface"
          >
            <span className="flex items-center justify-between gap-4">
              <span className="text-sm font-bold text-ink group-hover/item:text-brand">
                {item.label}
              </span>
              <Arrow />
            </span>
            {item.desc && (
              <span className="mt-1 block text-xs text-muted">{item.desc}</span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function Arrow() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="shrink-0 text-muted transition-transform group-hover/item:translate-x-0.5 group-hover/item:text-brand"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
