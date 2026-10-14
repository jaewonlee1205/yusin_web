import Link from "next/link";
import type { NavChild } from "@/data/site";

/**
 * 드롭다운 안쪽. 회사소개든 제품이든 모양은 이 하나뿐이다 — 같은 헤더에서
 * 번갈아 뜨는 패널이 서로 다르게 생기면 한 사이트로 보이지 않는다.
 * 항목이 어디서 오는지(nav의 children이냐 products.ts냐)는 Header가 정한다.
 *
 * ⚠️⚠️ **어두운 패널 위에 놓인다**(bg-dark-deep). 2026-10-14 에 흰 판에서
 *    갈았다 — 헤더·푸터가 같은 색이 되면서 드롭박스만 희면 떠 보였다.
 *    글자·화살표·hover 가 전부 그 전제로 잡혀 있으니 **밝은 판으로 되돌릴
 *    때는 넷을 함께** 되돌릴 것.
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
            /* ⚠️ hover 가 white/10 이다. 패널이 어두워(dark-deep) surface
               같은 밝은 회색을 깔면 칸이 통째로 튀어 오른다. */
            className="group/item block rounded-lg p-3 transition-colors hover:bg-white/10"
          >
            <span className="flex items-center justify-between gap-4">
              <span className="text-sm font-bold text-white group-hover/item:text-brand-light">
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
      className="shrink-0 text-white/50 transition-transform group-hover/item:translate-x-0.5 group-hover/item:text-brand-light"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
