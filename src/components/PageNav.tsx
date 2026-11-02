"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import Container from "./Container";
import { listedProducts } from "@/data/products";
import { nav, type NavChild } from "@/data/site";

/**
 * 배너(PageHero) 바로 아래 서는 **바로가기 띠**.
 *
 * ⚠️⚠️⚠️ **2026-11-02 판 (114) — 새로 생긴 부품이다.** 유신이 레퍼런스를
 *    주며 *"여기 회사소개 밑에 … 홈버튼 미디어센터 언론보도 이렇게 밑에
 *    바로 가기로 선택할 수 있게 디자인 하고 싶은데"* 라고 했다
 *    (https://itcenglobal.com/user/bbs/BD_selectBbsList.do?q_bbsSn=1020).
 *
 *    꼴은 **breadcrumb 인데 각 단계가 드롭다운**이다. 홈 네모 하나, 그 뒤에
 *    단계 둘, 단계마다 아래로 목록이 펼쳐진다. 레퍼런스를 브라우저로 열어
 *    쟀다 — 띠 50px · 홈 50x50 파란 네모 · 단계 칸 **260px 고정** · 글자
 *    16px 가운데 · 칸 오른쪽 0.8px 세로선 · 현재 쪽만 굵게.
 *
 * ⚠️ **자료를 새로 만들지 않는다.** site.ts 의 `nav` 를 그대로 읽는다 —
 *    메뉴가 이미 2단이라 그대로 들어맞는다. 제품이 늘거나 숨으면
 *    (products.ts 의 HIDDEN_SLUGS) 이 띠도 저절로 따라간다.
 *
 * ── 시안에서 고르신 것 (cmp-196 · cmp-197) ──────────────────────
 *
 * cmp-196 에서 **바탕 셋 x 칸 꼴 둘**을 보여 드렸고(월~토), cmp-197 에서
 * **칸 폭 다섯**을 보여 드렸다(차 카 타 파 하). 유신이 **「타」**를 고르셨다 —
 * 옅은 회색 바탕 · 세로선 칸 · **칸 200px**.
 *
 * ⚠️⚠️ **칸 폭은 cmp-196 에서 한 번 틀렸던 자리다.** 처음에 글자에 맞춘
 *    자동 폭(119/90px)으로 드렸더니 *"너무 따닥 따닥 붙어 있는 느낌이야 …
 *    너무 답답한 느낌이 드는데"* 를 들었다. 같은 자로 재 보니 —
 *      ITCEN GLOBAL   칸 260px · 1단계 글자 끝에서 2단계 글자 시작까지 200px
 *      cmp-196        칸 119/90px · 같은 거리 **63px**
 *    3.2배였다. **고정 폭의 빈자리가 이 띠의 숨구멍**이었다. 200px 에서는
 *    그 거리가 **159px** 이 된다(실측). **이 수를 좁히지 말 것.**
 *
 * ── 왜 이 색인가 ────────────────────────────────────────────────
 *
 * 바로 위가 **네이비 배너**다. 흰 띠는 본문과 같은 색이라 띠가 안 보이고
 * 본문의 첫 줄처럼 읽히고, 네이비 띠는 배너와 한 덩어리로 이어져 배너가
 * 48px 길어진 것으로 보인다. **옅은 회색만 배너와 본문 사이의 한 단**이
 * 되어 양쪽 어디에도 붙지 않는다.
 *
 * ⚠️ **홈 네모는 네이비다.** 레퍼런스는 그 회사의 메인 컬러인 파랑으로
 *    채웠는데, 여기서 같은 자리를 빨강으로 채우면 **빨강 채움은 견적 문의
 *    전용**이라는 규칙과 부딪친다(판 104 에서 아이콘 원을 빨강에서 네이비로
 *    돌린 그 규칙이다). 시안 cmp-196 의 곁가지 B 가 빨강 모습이었고
 *    유신이 고르지 않으셨다.
 *
 * ── 안 건드린 것 ────────────────────────────────────────────────
 *
 * ⚠️⚠️ **제품 상세 일곱 쪽에는 달지 않는다.** 거기만 PageHero 가 없고
 *    네이비 `Breadcrumb` 이 배너 자리를 맡고 있어, 이 띠를 그대로 깔면
 *    비슷한 띠가 둘이 된다. 시안 cmp-196 의 곁가지 E 로 갈아끼운 모습을
 *    보여 드리고 **셋 중 하나를 고르셔야 한다**고 적었는데 말씀이 없어
 *    **그대로 두었다**. 달 때는 `PageHero` 에 `path` 를 넘기는 대신
 *    `Breadcrumb` 자리를 이 부품으로 바꾼다.
 * ⚠️ **홈(/)에도 달지 않는다** — 거기는 PageHero 가 없다.
 */

/** 한 단계. 라벨은 지금 자리, 항목은 그 자리에서 고를 수 있는 것들. */
type Step = { label: string; items: NavChild[] };

/**
 * 지금 쪽에서 설 단계들을 `nav` 에서 뽑는다.
 *
 * ⚠️ **오시는 길과 문의하기는 2단계가 없다** — 그 쪽에서는 칸이 하나만
 *    선다. 시안 cmp-196 의 곁가지 D 가 그 모습이고, 허전하지 않다는 것을
 *    보고 넘어갔다.
 * ⚠️ `childrenFrom: "products"` 는 Header 와 **같은 꼴로** 푼다 —
 *    맨 앞이 「전체」이고 그 뒤가 제품들이다. 두 곳이 어긋나면 같은 메뉴가
 *    두 이름으로 불린다.
 */
function stepsFor(path: string): Step[] {
  const top = nav.find(
    (i) => i.href === path || (i.children ?? []).some((c) => c.href === path)
  );
  if (!top) return [];

  const tops: NavChild[] = nav.map((i) => ({ href: i.href, label: i.label }));
  const steps: Step[] = [{ label: top.label, items: tops }];

  const kids: NavChild[] =
    top.childrenFrom === "products"
      ? [
          { href: "/products", label: "전체" },
          ...listedProducts.map((p) => ({
            href: `/products/${p.slug}`,
            label: p.name,
          })),
        ]
      : (top.children ?? []);

  if (kids.length > 0) {
    const here = kids.find((c) => c.href === path);
    if (here) steps.push({ label: here.label, items: kids });
  }
  return steps;
}

export default function PageNav({ path }: { path: string }) {
  const steps = stepsFor(path);
  const [open, setOpen] = useState<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const baseId = useId();

  /* Escape 로 닫고, 띠 밖을 누르면 닫는다. Header 가 쓰는 짝과 같은
     꼴이다 — 한 쪽에서 두 드롭다운이 다르게 닫히면 안 된다. */
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(null);
    }
    function onPointerDown(e: PointerEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(null);
    }
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  if (steps.length === 0) return null;

  return (
    /* ⚠️ `z-20` 이 필요하다 — 펼친 목록이 아래 본문 위에 떠야 한다.
          헤더는 `z-50` 이라 스크롤해도 이 띠가 헤더를 덮지 않는다. */
    <div ref={rootRef} className="relative z-20 border-b border-line bg-surface">
      <Container>
        <nav aria-label="바로가기" className="flex h-12 items-stretch">
          {/* 홈 — 48x48 네이비 네모. 레퍼런스가 메인 컬러로 채운 자리다. */}
          <Link
            href="/"
            aria-label="홈으로"
            className="flex h-12 w-12 shrink-0 items-center justify-center bg-dark text-white transition-colors hover:bg-dark-deep"
          >
            <HomeIcon />
          </Link>

          {steps.map((step, i) => {
            const isOpen = open === i;
            const panelId = `${baseId}-${i}`;
            return (
              /* ⚠️ **칸 폭 200px 은 유신이 cmp-197 에서 고른 수다**(「타」).
                    `flex-[0_1_200px]` 와 `min-w-0` 이 **한 쌍**이다 — 390 에서
                    홈 48 + 200x2 = 448px 은 안쪽 350px 에 안 들어가므로
                    줄어들 수 있어야 한다. `min-w-0` 이 없으면 flex 항목의
                    기본 min-width 가 auto 라 내용 폭 아래로 안 내려가고
                    가로 스크롤이 생긴다. 실측 — 390 에서 139/139px. */
              <div
                key={step.label + i}
                className="relative flex min-w-0 flex-[0_1_200px] items-center"
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpen(isOpen ? null : i)}
                  /* ⚠️ 마지막 단계가 **지금 보고 있는 쪽**이라 굵고 진하다.
                        앞 단계는 가늘고 한 단 옅다 — 레퍼런스와 같은 짝이다
                        (상위 #4a4a4a 400 · 현재 #161616 700).

                     ⚠️⚠️ **앞 단계를 `text-muted` 로 내리지 말 것.** 처음에
                        그렇게 썼다가 **화면 픽셀로 재서** 되돌렸다 — 이 바탕
                        (#f6f7f9) 위에서 muted(#6b7280)는 **4.51** 이다.
                        AA(4.5)를 0.01 로 넘기는 수는 재는 판마다 오르내려
                        통과로 볼 수 없다(배너 eyebrow 를 390 에서 4.48 로
                        본 그 자리와 같은 판단이다 — PageHero.tsx 주석).
                        ink-soft(#414751)는 같은 바탕에서 **8.70** 이고,
                        레퍼런스의 상위 색(흰 바탕 8.9)과 거의 같은 자리다.
                        ⚠️ 글자 셈이 아니라 **픽셀**로 잰 값이다. Tailwind v4 는
                           computed color 를 oklab 으로 내보내 토큰으로 셈하면
                           어긋난다.
                        ⚠️ 그래도 두 단계는 **굵기로** 갈린다(400 ↔ 700).
                           색으로만 가르려 하면 둘 중 하나가 반드시 흐려진다
                           [[weak-line-means-contrast-not-width]]. */
                  className={`flex h-12 w-full min-w-0 items-center justify-center gap-2.5 border-r border-line px-3.5 text-15 transition-colors hover:text-ink ${
                    i === 0 ? "border-l border-line" : ""
                  } ${
                    i === steps.length - 1
                      ? "font-bold text-ink"
                      : "font-normal text-ink-soft"
                  }`}
                >
                  <span className="truncate">{step.label}</span>
                  <Chevron open={isOpen} />
                </button>

                {isOpen && (
                  <ul
                    id={panelId}
                    className="absolute left-0 top-12 z-30 min-w-full border border-t-0 border-line bg-white py-1.5 shadow-overlay"
                  >
                    {step.items.map((it) => {
                      const now = it.href === path;
                      return (
                        <li key={it.href}>
                          <Link
                            href={it.href}
                            aria-current={now ? "page" : undefined}
                            onClick={() => setOpen(null)}
                            className={`block whitespace-nowrap px-5 py-2 text-sm transition-colors hover:bg-field hover:text-brand ${
                              now ? "bg-field font-bold text-ink" : "text-ink-soft"
                            }`}
                          >
                            {it.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
        </nav>
      </Container>
    </div>
  );
}

/** 집 모양. 사이트에 홈 아이콘이 없어 여기서 그린다(19px, 선 1.8). */
function HomeIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.6V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.6" />
    </svg>
  );
}

/** Header 의 Chevron 과 **같은 그림**이다. 한 사이트에서 화살표가 둘이면
    같은 뜻을 두 모양으로 말하는 꼴이라, 크기만 12px 로 줄여 쓴다. */
function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`shrink-0 opacity-65 transition-transform ${open ? "rotate-180" : ""}`}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
