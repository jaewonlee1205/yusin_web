"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Container from "./Container";
import type { NavChild } from "@/data/site";

/**
 * PageHero 바로 아래 붙는 하위 탭 바. 회사소개 3개 페이지가 공유한다.
 * 폭이 좁으면 가로로 스크롤되고, 현재 페이지 탭에 아래 강조선이 붙는다.
 */
export default function SubNav({ items }: { items: NavChild[] }) {
  const pathname = usePathname();
  // trailingSlash 설정 때문에 경로 끝에 / 가 붙는다. 비교 전에 떼어 낸다.
  const current = pathname.replace(/\/+$/, "") || "/";

  return (
    <div className="border-b border-line bg-white">
      <Container>
        <nav aria-label="회사소개 하위 메뉴">
          <ul className="-mx-5 flex gap-1 overflow-x-auto px-5 sm:mx-0 sm:px-0">
            {items.map((item) => {
              const active = current === item.href;
              return (
                <li key={item.href} className="shrink-0">
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`block border-b-2 px-4 py-4 text-sm font-medium transition-colors ${
                      active
                        ? "border-brand text-brand"
                        : "border-transparent text-ink-soft hover:text-ink"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </Container>
    </div>
  );
}
