"use client";

import { useRef, useState } from "react";
import ProductCard from "./ProductCard";
import { CATEGORIES, products, type ProductCategory } from "@/data/products";

/**
 * 제품 목록 + 분류 거르개.
 *
 * lg 부터는 왼쪽에 분류 목록을 고정해 둔다(sticky). 전에는 가로 칩 한 줄뿐이라
 * 스크롤하면 분류가 화면 밖으로 나가, 아래쪽 제품을 보다가 분류를 바꾸려면
 * 위로 되돌아가야 했다. 칩 줄은 버리지 않고 lg 미만에서 그대로 쓴다 — 좁은
 * 화면에서는 세로 목록이 자리를 너무 많이 먹는다.
 *
 * 둘은 같은 state 를 본다. 1024 경계를 넘나들어도 고른 분류가 유지된다.
 *
 * 거르기는 클라이언트 상태다. 분류별 URL(북마크·뒤로가기)로 만들려면 정적
 * 내보내기(output: "export") 특성상 라우트를 분류 수만큼 늘려야 한다.
 */
type Filter = "전체" | ProductCategory;

const FILTERS: Filter[] = ["전체", ...CATEGORIES];

const countOf = (f: Filter) =>
  f === "전체" ? products.length : products.filter((p) => p.category === f).length;

/** 사이드바가 붙는 높이(lg:top-24)와 같은 값. 헤더(81px)를 15px 띄운다. */
const STICK_TOP = 96;

export default function ProductBrowser() {
  const [filter, setFilter] = useState<Filter>("전체");
  const resultRef = useRef<HTMLDivElement>(null);

  const visible =
    filter === "전체" ? products : products.filter((p) => p.category === filter);

  /**
   * 분류를 고른다. 고르기 전에 결과 영역을 화면 안으로 끌어올린다.
   *
   * 7개에서 1개로 줄면 문서가 900px 넘게 짧아지는데, 브라우저는 스크롤을
   * 새 최대값까지 깎기만 하고 "결과를 보여 줘야 한다" 는 건 모른다. 맨 아래
   * 까지 내려가 분류를 바꾸면 결과가 화면 위로 292px 벗어난 채 하단 CTA 만
   * 보였다.
   *
   * setFilter 보다 먼저 옮기는 게 핵심이다. 결과 영역 윗변의 문서상 위치는
   * 거르기로 변하지 않으므로(바뀌는 건 그 아래 그리드 높이뿐이다) 지금
   * 계산해도 값이 같고, 아직 문서가 길 때 올리는 것이라 깎이지 않는다.
   * 효과(useEffect)로 미루면 한 프레임 튀거나 SSR 경고가 붙는다.
   *
   * 그리드가 아니라 결과 칸 윗변을 기준으로 삼는다 — 그래야 카운트 줄
   * ("1개 제품")까지 보인다. lg 미만에서는 칩 줄도 이 칸 안에 있어 올라간
   * 뒤 바로 다음 분류를 고를 수 있다.
   *
   * 부드럽게 올리지 않는다. 내용이 이미 바뀐 자리를 바로잡는 동작이라
   * 즉시 옮기는 쪽이 자연스럽다(scrollToTop 의 애니메이션은 "맨 위로" 처럼
   * 사용자가 스스로 시킨 이동에만 쓴다).
   */
  const pick = (next: Filter) => {
    const el = resultRef.current;
    if (el) {
      const top = el.getBoundingClientRect().top;
      // 화면 위로 벗어났을 때만 건드린다. 맨 위에서 눌렀는데 화면이 튀면
      // 더 나쁘다.
      if (top < STICK_TOP) window.scrollTo(0, window.scrollY + top - STICK_TOP);
    }
    setFilter(next);
  };

  return (
    /* lg:items-start 가 없으면 안 된다. 그리드/플렉스 기본값(stretch)이면
       aside 가 행 높이를 꽉 채워 sticky 가 아무 일도 하지 않는다. */
    <div className="lg:flex lg:items-start lg:gap-8">
      {/* 헤더가 sticky top-0 에 81px 다. top-24(96px)면 15px 뜬다. */}
      <aside className="hidden lg:sticky lg:top-24 lg:block lg:w-52 lg:shrink-0">
        {/* 머리말을 "제품 분류" 로 둔다 — 배너 eyebrow 가 이미 PRODUCTS 라
            영문을 또 쓰지 않는다. */}
        <nav
          aria-label="제품 분류"
          className="overflow-hidden rounded-lg border border-line bg-white"
        >
          <p className="bg-navy px-5 py-3.5 text-xs font-bold tracking-[0.2em] text-white">
            제품 분류
          </p>
          <ul className="border-t border-line">
            {FILTERS.map((f) => {
              const active = f === filter;
              return (
                <li key={f}>
                  {/* 왼쪽 2px 띠로 선택을 표시한다. 글자를 들여쓰거나 배경만
                      바꾸면 어느 줄이 켜졌는지 훑어서 안 보인다. */}
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() => pick(f)}
                    className={`flex w-full items-center justify-between gap-2 border-l-2 px-5 py-3 text-left text-sm transition-colors ${
                      active
                        ? "border-brand bg-surface font-bold text-navy"
                        : "border-transparent font-medium text-ink-soft hover:bg-surface hover:text-ink"
                    }`}
                  >
                    {f}
                    <span
                      className={`text-xs tabular-nums ${
                        active ? "text-navy" : "text-muted"
                      }`}
                    >
                      {countOf(f)}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* min-w-0 — 없으면 플렉스 항목의 최소 폭이 내용 크기라 그리드가
          사이드바를 밀어낸다. */}
      <div ref={resultRef} className="min-w-0 lg:flex-1">
        {/* 화면에는 카운트 줄("7개 제품")이 이 영역의 제목 노릇을 하지만
            제목 태그는 아니다. 전에는 위에 있던 피더 정의 박스의 h2 가
            h1(제품)과 카드의 h3 사이를 메웠는데, 그 박스를 빼면서 h1 -> h3
            로 건너뛰어 heading-order 가 깨졌다(접근성 100 -> 98).
            사이드바의 "제품 분류" 는 hidden lg:block 이라 좁은 화면에서
            사라지므로 그걸로는 메울 수 없다. */}
        <h2 className="sr-only">제품 목록</h2>

        {/* 좁은 화면용 칩 줄. 가로 스크롤이라 -mx-5 px-5 로 화면 끝까지 흘린다. */}
        <nav
          aria-label="제품 분류"
          className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:flex-wrap sm:px-0 lg:hidden"
        >
          {FILTERS.map((f) => {
            const active = f === filter;
            return (
              <button
                key={f}
                type="button"
                aria-pressed={active}
                onClick={() => pick(f)}
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
                  {countOf(f)}
                </span>
              </button>
            );
          })}
        </nav>

        {/* 분류를 바꾸면 이 수가 따라 바뀌어, 눌린 게 먹혔다는 신호가 된다. */}
        <p className="mb-5 mt-6 text-sm text-ink-soft lg:mt-0">
          <span className="font-bold tabular-nums text-ink">{visible.length}</span>
          개 제품
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
