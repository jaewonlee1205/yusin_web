"use client";

import { useState } from "react";
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

export default function ProductBrowser() {
  const [filter, setFilter] = useState<Filter>("전체");

  const visible =
    filter === "전체" ? products : products.filter((p) => p.category === filter);

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
                    onClick={() => setFilter(f)}
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
      <div className="min-w-0 lg:flex-1">
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

        {/* 제품에 대한 말이라 그리드와 같은 기둥에 세운다. 전에는 페이지
            맨 아래 전폭이었다. */}
        <p className="mt-12 rounded-lg border border-line bg-surface px-6 py-5 text-sm leading-relaxed text-ink-soft">
          모든 제품은 공급할 부품에 맞춰 제작합니다. 정해진 표준 기종을 고르는
          방식이 아니라, 부품 샘플을 받아 형상을 분석한 뒤 볼 형상과 정렬 지그를
          새로 설계합니다. 기종별 상세 사양이 필요하시면 문의해 주세요.
        </p>
      </div>
    </div>
  );
}
