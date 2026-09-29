import Link from "next/link";
import type { NavChild } from "@/data/site";

/**
 * 드롭다운 안쪽. 회사소개든 제품이든 모양은 이 하나뿐이다 — 같은 헤더에서
 * 번갈아 뜨는 패널이 서로 다르게 생기면 한 사이트로 보이지 않는다.
 * 항목이 어디서 오는지(nav의 children이냐 products.ts냐)는 Header가 정한다.
 */

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
