"use client";

import Link from "next/link";
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
   * 그리드가 아니라 결과 칸 윗변을 기준으로 삼는다 — 그래야 도구 줄
   * ("파츠피더 … 1개")까지 보인다. lg 미만에서는 칩 줄도 이 칸 안에 있어
   * 올라간 뒤 바로 다음 분류를 고를 수 있다.
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
          className="overflow-hidden rounded-2xl bg-white shadow-card"
        >
          <p className="bg-navy px-5 py-3.5 text-xs font-bold tracking-[0.08em] text-white">
            제품 분류
          </p>
          <ul className="border-t border-line">
            {FILTERS.map((f) => {
              const active = f === filter;
              return (
                <li key={f}>
                  {/* 선택은 글자로 표시한다 — navy 굵은 글자 + 오른쪽 개수도
                      navy + 연한 배경(surface). 전에는 왼쪽에 2px 빨간 띠를
                      더 붙였는데, 띠 없이도 첫 줄이든 가운데 줄이든 또렷하게
                      읽혀 뺐다. 화면에서 빨강이 하나 줄어 헤더 CTA 와 카드
                      라벨이 더 또렷해진다.

                      띠를 걷으면서 정렬도 맞았다. border-l-2 가 있을 때는
                      글자가 22px 에서 시작해 위 navy 헤더("제품 분류", px-5
                      라 20px)와 2px 어긋나 있었다. 이제 두 x 가 같다. */}
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() => pick(f)}
                    className={`flex w-full items-center justify-between gap-2 px-5 py-3 text-left text-sm transition-colors ${
                      active
                        ? "bg-surface font-bold text-navy"
                        : "font-medium text-ink-soft hover:bg-surface hover:text-ink"
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

        {/* 사이드바는 354px 인데 격자는 1400px 가까이 된다. 붙어서 따라다니는
            자리라, 스크롤 내내 왼쪽 아래가 비어 보였다. 그 자리를 전환으로
            쓴다.

            빨강 버튼을 쓰지 않는다 — 페이지 맨 아래 ContactCTA 가 이미 빨강
            버튼이고, 한 화면에 같은 세기의 유도가 둘이면 둘 다 약해진다.
            여기는 navy 글자 링크로 조용히 둔다.

            문구는 배너 lead·ContactCTA·/contact lead 와 글자가 겹치지 않게
            새로 썼다. 같은 말을 두 번 읽게 하지 않는다. */}
        <div className="mt-4 rounded-2xl bg-white p-5 shadow-card">
          <p className="text-sm font-bold leading-relaxed text-ink">
            목록에 없는 부품인가요?
          </p>
          {/* 한때 여기에 "형태가 달라도 만듭니다. 샘플을 보고 정합니다." 두
              줄이 있었다. 걷어 달라는 요청에 뺐다 — 제목 한 줄이 이미 같은
              것을 묻고 있어 뜻이 줄지 않는다.

              ⚠️ 글자 링크를 테두리 박스로 바꿨다. 설명이 빠지니 글자 링크
                 하나만 남아 허전했다. **위 "빨강 버튼을 쓰지 않는다" 는 그대로
                 유효하다** — 이 버튼은 navy 테두리이고 바탕이 없다.

                 색은 제품 상세의 "제품 목록" 버튼(border-navy/30 … hover:
                 border-navy hover:bg-surface)에서 가져왔다. 사이트의 공통
                 BTN 은 hover 가 brand 로 번져 여기 쓸 수 없다. */}
          <Link
            href="/contact/"
            className="group mt-4 flex items-center justify-center gap-1.5 rounded-xl border border-navy/30 px-4 py-2.5 text-[13px] font-semibold text-navy transition-colors hover:border-navy hover:bg-surface"
          >
            제작 문의
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="shrink-0 transition-transform group-hover:translate-x-1"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </div>
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

        {/* 좁은 화면용 칩 줄. 가로 스크롤이라 -mx-5 px-5 로 화면 끝까지 흘린다.

            스크롤막대를 숨긴다. 390px 에서 칩이 804px 라 429px 가 넘치는데,
            윈도 크롬은 15px 짜리 가로 막대를 칩 바로 아래 그려 버린다 —
            줄 높이 65px 중 15px 이 막대였다. 대신 오른쪽 끝을 흐리게 지워
            "더 있다" 를 알린다. sm 부터는 칩이 줄바꿈되어 넘치지 않으므로
            마스크를 끈다. */}
        <nav
          aria-label="제품 분류"
          className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-0.5 [mask-image:linear-gradient(to_right,#000_calc(100%-40px),transparent)] [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 sm:[mask-image:none] lg:hidden [&::-webkit-scrollbar]:hidden"
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

        {/* 도구 줄. 높이를 45px 로 못 박아 아랫선이 사이드바 헤더("제품 분류")
            아랫선과 같은 y 에 오게 한다 — 사이드바 카드 테두리 1px +
            py-3.5(14+14) + text-xs 줄높이 16 = 45. 이 선이 없을 때는 첫 카드
            윗변이 사이드바 카드 윗변보다 40px 아래라, 두 열의 윗부분이
            어긋나 보였다.

            왼쪽에 고른 분류를 적는다. 숫자만 있으면 지금 무엇을 보고 있는지
            알 수 없고, 분류를 바꿔도 7 -> 1 처럼 수만 바뀐다. */}
        <div className="mt-6 flex h-[45px] items-center justify-between border-b border-line lg:mt-0">
          <p className="text-sm font-bold text-ink">
            {filter === "전체" ? "전체 제품" : filter}
          </p>
          <p className="text-sm text-ink-soft">
            <span className="font-bold tabular-nums text-ink">
              {visible.length}
            </span>
            개
          </p>
        </div>

        {/* key 를 분류로 두어 다시 그리게 하고 짧게 덮어쓴다(120ms).
            Reveal 은 쓰지 않는다 — 거를 때마다 카드가 올라오면 고르는 동작이
            느려진다. */}
        {/* 1024~1279 는 2열이다. 여기서 3열을 쓰면 사이드바(208)+간격(32)을
            뺀 자리에 끼여 카드가 219px, 요약 글상자가 169px 까지 줄어 어떤
            문구도 두 줄에 안 들어갔다. 2열이면 카드 340px, 요약 290px 가
            된다. 3열은 xl(1280)부터다. */}
        <div
          key={filter}
          className="grid-swap mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
        >
          {visible.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
