"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Container from "./Container";
import type { NavChild } from "@/data/site";

/**
 * PageHero 바로 아래 붙는 하위 탭 바. 회사소개 3개 페이지가 공유한다.
 * 현재 페이지 탭에 아래 강조선이 붙는다.
 *
 * ul 의 음수 여백은 눈속임이 아니라 정렬 장치다. 지우지 말 것.
 *  -ml-4 : 링크의 px-4 만큼 목록을 당겨, 첫 탭의 "글자"가 페이지 좌측선
 *          (h1·리드·본문 h2)과 같은 세로선에 서게 한다. 이게 없으면 탭만
 *          혼자 16px 안으로 들어가 보인다.
 *  -mb-px: 목록을 1px 내려 링크의 아래 테두리가 바의 구분선을 덮게 한다.
 *          안 그러면 빨간 밑줄 바로 밑에 회색 선이 붙어 두 줄로 보인다.
 *  -mr-5 / pr-5 : 항목이 늘어 넘칠 때 목록이 화면 끝까지 흐르되, 끝까지
 *          스크롤했을 때 마지막 탭이 가장자리에 달라붙지 않게 한다.
 *          (지금 라벨 3개로는 좁은 화면에서도 넘치지 않는다)
 */
export default function SubNav({ items }: { items: NavChild[] }) {
  const pathname = usePathname();
  // trailingSlash 설정 때문에 경로 끝에 / 가 붙는다. 비교 전에 떼어 낸다.
  const current = pathname.replace(/\/+$/, "") || "/";

  return (
    <div className="border-b border-line bg-white">
      <Container>
        <nav aria-label="회사소개 하위 메뉴">
          <ul className="-mb-px -ml-4 -mr-5 flex gap-1 overflow-x-auto pr-5 sm:-mr-4 sm:pr-4">
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
