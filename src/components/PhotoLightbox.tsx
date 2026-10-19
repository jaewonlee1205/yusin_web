"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Work } from "@/data/works";
import Reveal from "./Reveal";

/**
 * 격자를 **통째로 한 번에** 띄운다. 끄면 그냥 격자다.
 *
 * ⚠️⚠️ **한때 칸마다 `Reveal delay={i * 70}` 이었다.** 2026-10-19 에 유신이
 *    짚었다 — *"1개가 아니라 묶음으로 보이게"*, *"제품 7개가 한번에
 *    보여지는거지"*. 사이트의 모든 격자를 묶음으로 바꾼 그 판이다.
 * ⚠️ **delay 를 0 으로 맞추는 것으로는 안 된다.** 칸마다
 *    IntersectionObserver 가 따로라, 긴 격자에서는 아래 칸이 화면에
 *    **나중에** 들어와 결국 차례로 뜬다. 관찰 대상이 격자 **하나**여야
 *    한 번에 뜬다.
 * ⚠️ 모듈 바깥에 둔다. 컴포넌트 안에서 만들면 렌더마다 **새 타입**이 되어
 *    React 가 격자를 통째로 다시 붙인다 — 사진이 매번 깜빡인다.
 */
function Group({ on, children }: { on: boolean; children: React.ReactNode }) {
  return on ? <Reveal>{children}</Reveal> : <>{children}</>;
}

/**
 * 납품 설비 사진 — 격자 · 분류 버튼 · 크게보기.
 *
 * ⚠️⚠️ **격자까지 이 안에 들어 있다.** 칸을 누르면 열리는 구조라 **칸 자체가
 *    클라이언트여야 한다.** 서버 격자가 클라이언트 칸을 감싸 봐야 얻는 것이 없다.
 *    목록은 `works.ts` 에서 넘겨받으므로 번들이 아니라 페이지 HTML 로 간다.
 *
 * ⚠️ 사진은 **두 벌**이다(`works.ts` 주석). 격자는 `src`(1000px), 크게보기는
 *    `full`(1600px). **열 때만** 큰 것을 받는다 — `output: "export"` 라
 *    Next.js 가 리사이즈해 주지 않기 때문이다.
 *
 * ⚠️ 자막 띠는 `ProductVideo` 와 **같은 값**을 쓴다
 *    (`from-dark/85 via-dark/40 to-transparent`). 사이트 안에서 사진과 영상이
 *    같은 말투여야 한다.
 */
export default function PhotoLightbox({
  items,
  kinds,
  reveal = false,
  cols = "grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4",
  className = "",
}: {
  items: Work[];
  /** 분류 버튼에 쓸 기종. 안 주면 버튼을 내지 않는다(홈). */
  kinds?: string[];
  /**
   * 격자를 **스크롤 리빌**로 띄운다 — 홈 **열여섯 장이 한 번에**
   * (2026-10-19 에 여덟에서 늘었다).
   *
   * ⚠️⚠️ 유신이 짚었다 — *"여기 애니메이션 적용이 되야 할 거 같고 메인
   *    페이지 쪽이야"*. 홈에서 **리빌이 없는 유일한 콘텐츠 섹션**이었다.
   *    2026-10-16 에 거래처 이름 격자(`ClientGrid`, 리빌 있음)를 이 사진
   *    격자로 바꾸면서 딸려 나갔다.
   * ⚠️ 한때 `i * 70` 으로 칸마다 늦췄다(바로 위 VIDEO 섹션과 같은 값이었다).
   *    2026-10-19 에 묶음으로 바꿨다 — 위 `Group` 주석 참고.
   * ⚠️⚠️ **`/clients` 에서는 여전히 켜지 않는다.** 분류를 누를 때마다 155칸이
   *    통째로 다시 페이드인하면 산만하다. 묶음이 되어 관찰자 수 걱정
   *    (155개)은 사라졌지만 **다시 뜨는 산만함**은 그대로다.
   */
  reveal?: boolean;
  /**
   * 격자의 **열 수 전체**. 기본값은 /clients 가 쓰는 것이다.
   *
   * ⚠️⚠️ 클래스 문자열에 `lg:grid-cols-4` 를 **덧붙이지 말 것.** Tailwind 는
   *    같은 변형(lg)끼리 충돌하면 class 속성의 순서가 아니라 **생성된 CSS 의
   *    순서**로 이긴 쪽을 정한다 — 어느 쪽이 적용될지 알 수 없다. 그래서
   *    기본 문자열을 통째로 **갈아 끼우는** prop 으로 두었다.
   *
   * 홈이 `grid-cols-2 md:grid-cols-4` 로 바꿔 쓰는 까닭 — 2026-10-19 에 홈
   * 사진이 여덟에서 **열여섯**이 됐다(유신 요청). **16 을 나누어떨어뜨리는
   * 열 수는 2 와 4 뿐**이라, 3열이 끼면 어느 폭에서든 마지막 줄에 한 칸만
   * 남는다(16 = 3x5 + 1). 기본값대로 두고 찍어 보니 768 에서 정말 그랬고,
   * 다섯 줄 끝에 외톨이 한 칸이 **덜 만든 것처럼** 보였다. 그래서 홈만 3열을
   * 건너뛴다 —
   *
   *     ~639   2열  8줄 딱     (칸 175px — 390 기준)
   *   640~767  2열  8줄 딱     (칸 300px)
   *   768~     4열  4줄 딱     (칸 176px — 모바일 2열 칸과 같은 크기다)
   *
   * md(768)에서 4열로 가도 칸이 모바일 칸보다 작아지지 않는 것이 고른 점이다.
   * sm(640)부터 4열로 하면 칸이 142px 이 되어 모바일보다 **작아진다** — 자막이
   * 사진을 덮으므로 거기까지 내리지 않는다.
   *   ⚠️ 2026-10-19 에 자막이 **한 줄로 고정**됐다(truncate). 두 줄짜리가
   *      사라졌으니 "덮는다" 는 근거가 그만큼 약해졌다. 그래도 **되돌리지
   *      말 것** — 142px 칸은 자막 한 줄(띠 63px)만으로도 칸 높이(95px)를
   *      넘는다. 이제 근거는 "자막" 이 아니라 **칸 크기 자체**다.
   *
   * ⚠️ `/clients` 는 155장이라 3열에서 끝줄이 두 칸 남는다(155 = 3x51 + 2).
   *    외톨이가 아니므로 기본값을 그대로 쓴다.
   */
  cols?: string;
  className?: string;
}) {
  const [filter, setFilter] = useState<string | null>(null);
  const [open, setOpen] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  /**
   * 분류를 고르면 **격자 머리가 화면 밖일 때만** 끌어 올린다.
   *
   * ⚠️⚠️ 유신이 짚었다 — *"밑으로 스크롤 계속하고 옆에 진동기 버튼 누르면 …
   *    사용자가 다시 위로 스크롤 해서 올려야해. **제품 라인업 여기서는** …
   *    옆에 버튼 누르면 위로 알아서 스크롤 해서 올려져서"*.
   *    `ProductBrowser.tsx` 가 이미 하던 일인데 여기만 빠져 있었다.
   *    **같은 장치는 같게 움직여야 한다.**
   * ⚠️ 위로 벗어났을 때만 건드린다. 맨 위에서 눌렀는데 화면이 튀면 더 나쁘다.
   * ⚠️ 부드럽게 올리지 않는다 — 내용이 바뀐 자리를 바로잡는 동작이라
   *    즉시 옮기는 쪽이 자연스럽다.
   *
   * ⚠️⚠️⚠️ **스크롤을 리렌더 *뒤에* 한다.** 처음에는 ProductBrowser 처럼
   *    `scrollTo` 를 먼저 하고 `setFilter` 를 했는데, 유신이 짚었다 —
   *    *"방음커버나 표면처리 누르고 밑으로 스크롤 한다음 호퍼피더 버튼 누르면
   *      **다른것들보다 훨씬 더 위로 올라가는** 버그"*. 재서 보니 —
   *
   *      표면처리 → 호퍼피더   끝난 자리 **y=0**   격자 머리 596
   *      방음커버 → 호퍼피더   y=310              286
   *      볼피더  → 직진피더   y=456              140 ✓
   *
   *    분류를 바꾸면 **문서 높이가 확 줄어든다**(69칸 → 19칸은 1,900px). 먼저
   *    옮겨 둔 스크롤을 브라우저가 **최대값으로 잘라** 버려서, 바닥 근처에
   *    있었을수록 더 많이 올라간다.
   *    ⚠️ **ProductBrowser 에서 빌려 온 코드다.** 거기는 제품이 일곱이라
   *       높이가 비슷해 티가 안 났다 — 여기는 **155 ↔ 2** 다.
   *       **그쪽에서 괜찮았다는 것이 여기서도 괜찮다는 뜻은 아니다.**
   *    그래서 ① 먼저 상태를 바꾸고 ② `requestAnimationFrame` 으로 **새 레이아웃이
   *    선 뒤에** ③ **문서 기준 절대 좌표**로 옮긴다. 절대 좌표라 브라우저가
   *    중간에 스크롤을 잘라도 결과가 같다.
   *
   * ⚠️⚠️⚠️⚠️ **위 「최대값으로 잘라」는 틀린 진단이었다.** 2026-10-16 에
   *    유신이 다시 짚었다 — *"표면처리 버튼 누르고 **스크롤 하지 않은 상태에서**
   *    호퍼피더 버튼 누르면 위로 많이 올라가는데?"*. **두 번 연속** 누를 때만
   *    남아 있었다. 프레임마다 찍어 보니(abs = 격자 머리의 문서상 위치) —
   *
   *      f0  y=456  resTop= 96  abs=552  docH=2200  maxY=1300   <- rAF 가 도는 자리
   *      f1  y=456  resTop= 96  abs=552  docH=2200  maxY=1300
   *      f2  y=310  resTop=242  abs=552  docH=2054  maxY=1154   <- 브라우저가 내렸다
   *      f3~ y=310  resTop=242  abs=552  docH=2054
   *
   *    `abs` 는 **552 로 내내 같다** — 격자 머리의 문서상 위치는 분류와 무관하다.
   *    내 rAF 는 f1 에서 돌았고 `456 > 552-96` 이 **거짓**이라 아무것도 하지
   *    않았다. 그 뒤 **f2 에서 브라우저가 스스로** 456 → 310 으로 내렸다.
   *    maxY 가 1154 라 **456 은 유효한 값이었다 — 잘린 것이 아니다.**
   *    범인은 **스크롤 앵커링**이다. 브라우저는 내용이 바뀌면 *화면에 보이던
   *    것*을 제자리에 두려고 스크롤을 자동 보정하는데, 앵커로 잡던 사진이
   *    사라지면서 146px 를 끌어내렸다.
   *    ⚠️ **내가 무엇을 하든 그 뒤에 덮어쓴다.** 그래서 격자에
   *       `[overflow-anchor:none]` 을 걸어 **보정을 끈다**(그 자리 주석 참고).
   *       런타임에 `auto` 로 되살려 보면 유신이 짚은 두 각본이 **그대로**
   *       재현된다 — 격자 머리가 552 · 242(96 이어야 한다). **이 한 줄이
   *       고침이다.**
   *    ⚠️ 아래에서 `absTop` 을 **클릭 직전에** 재 두는 것은 **대비**다.
   *       그것만으로 고쳐지는지는 확인하지 않았다. rAF 시점은 레이아웃이
   *       흔들리는 중이라 거기서 다시 재는 것보다 안전하다는 판단이다.
   */
  const STICK_TOP = 96; // 헤더 81px + 15px. ProductBrowser 와 같은 값
  const pick = (next: string | null) => {
    // ⚠️ **지금**(레이아웃이 안정된 상태) 잰다. 위 프레임 로그의 abs 가 552 로
    //    내내 같았던 것이, 분류가 바뀌어도 이 값이 유효하다는 증거다.
    const el = resultRef.current;
    const absTop = el
      ? el.getBoundingClientRect().top + window.scrollY
      : null;
    setFilter(next);
    setOpen(null);
    if (absTop === null) return;
    requestAnimationFrame(() => {
      if (window.scrollY > absTop - STICK_TOP) {
        window.scrollTo(0, Math.max(0, absTop - STICK_TOP));
      }
    });
  };

  /* ⚠️ 거르는 법은 **포함**이다 — 「볼피더」를 누르면 ["볼피더","직진피더"] 도
     나와야 한다. 한 틀에 둘이 올라간 설비를 볼피더에서 빼면 안 된다. */
  const shown = useMemo(
    () => (filter ? items.filter((w) => w.kinds.includes(filter)) : items),
    [items, filter],
  );

  /* ⚠️⚠️ **크게보기는 포털로 `body` 에 붙인다.** 그냥 `fixed` 로 두면 **헤더가
     그 위에 뜬다.** 헤더도 `z-50` 이고 `sticky` 라 자기 쌓임 맥락을 만드는데,
     크게보기는 Section 안에 있어 **그 맥락에 갇힌다** — z-index 를 아무리
     올려도 밖으로 못 나간다.
     ⚠️ 포털은 서버에서 렌더할 수 없으므로 **마운트된 뒤에만** 쓴다. */
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const close = useCallback(() => {
    setOpen(null);
    openerRef.current?.focus();
  }, []);

  const move = useCallback(
    (d: number) => setOpen((i) => (i === null ? null : (i + d + shown.length) % shown.length)),
    [shown.length],
  );

  useEffect(() => {
    if (open === null) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") move(1);
      else if (e.key === "ArrowLeft") move(-1);
      else if (e.key === "Tab") {
        const f = dialogRef.current?.querySelectorAll<HTMLElement>("button");
        if (!f?.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);

    /* ⚠️ 배경 스크롤을 잠근다. 스크롤막대가 사라지며 폭이 바뀌어 **내용이 옆으로
       튀는 것**은 padding 으로 막는다. */
    const gap = window.innerWidth - document.documentElement.clientWidth;
    const prev = document.body.style.cssText;
    document.body.style.overflow = "hidden";
    if (gap > 0) document.body.style.paddingRight = `${gap}px`;

    dialogRef.current?.querySelector("button")?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.cssText = prev;
    };
  }, [open, close, move]);

  const cur = open === null ? null : shown[open];

  /* 크게보기의 단추들. ⚠️ 앞 판은 `bg-white/10` 원이었는데 유신이
     *"화살표 버튼 x 버튼 흐리게 처리된 것 등 … 너무 촌스러워서 토스 스타일처럼
     미니멀하고 깔끔하게"* 라고 했다. **배경을 걷고 선만** 남긴다 —
     평소 white/50, hover 에서 흰색. 누를 자리는 44px 로 그대로 둔다. */
  const ICON =
    "grid h-11 w-11 place-items-center rounded-full text-white/50 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/60";

  return (
    <>
      {/* ⚠️⚠️ **2026-10-16 — 분류를 위 칩에서 옆 패널로 옮겼다.** 유신이
          짚었다 — *"제품 분류 여기 처럼 **옆에 패널로** 나오게 하는게 더 좋은거
          같아 … 지금 구조에서는 사용자가 **위로 올린다음 눌러야** 되잖아"*.
          맞는 말이다. 사진이 155장이라 아래까지 내려가면 칩이 화면 밖으로
          사라지고, 분류를 바꾸려면 맨 위까지 되돌아가야 했다.
          ⚠️ 구조와 값은 `ProductBrowser` 에서 그대로 가져왔다 —
             `lg:items-start` 가 없으면 **aside 가 행 높이를 꽉 채워 sticky 가
             죽는다.** `lg:top-24`(96px)는 헤더 81px 에 15px 을 띄운 값이다.
          ⚠️ **모바일에서는 칩을 그대로** 둔다(ProductBrowser 도 그렇다). 좁은
             화면에 세로 목록을 얹으면 사진이 보이기까지 한참 내려야 한다. */}
      <div className="lg:flex lg:items-start lg:gap-8">
        {kinds && kinds.length > 1 && (
          <aside className="hidden lg:sticky lg:top-24 lg:block lg:w-52 lg:shrink-0">
            <nav
              aria-label="기종"
              className="overflow-hidden rounded-2xl bg-white shadow-card"
            >
              {/* 머리말은 「기종」 — 배너가 이미 WORKS 라 영문을 또 쓰지 않는다. */}
              {/* ⚠️ **가운데 정렬이다**(2026-10-19). 유신이 *"이거 왼쪽 정렬로
                     되어 있는데 가운데 정렬로 하면 좋겠고"* 라고 했다. 제품 쪽
                     「제품 분류」 거르개(ProductBrowser)와 **같은 마크업**이라
                     둘을 함께 바꿨다 — 한쪽만 바꾸면 같은 부품이 쪽마다
                     달라 보인다. */}
              <p className="bg-dark-soft px-5 py-3.5 text-center text-xs font-bold tracking-[0.08em] text-white">
                기종
              </p>
              <ul className="border-t border-line">
                {[null, ...kinds].map((k) => {
                  const active = filter === k;
                  return (
                    <li key={k ?? "전체"}>
                      <button
                        type="button"
                        aria-pressed={active}
                        onClick={() => pick(k)}
                        /* ⚠️ `gap-2` 를 걷었다(2026-10-19) — 자식이 글자
                           하나뿐이라 벌릴 것이 없고, 가운데 정렬에서는
                           더더욱 없다. ProductBrowser 도 같다. */
                        className={`flex w-full items-center justify-center px-5 py-3 text-center text-sm transition-colors ${
                          active
                            ? "bg-surface font-bold text-brand"
                            : "font-medium text-ink-soft hover:bg-surface hover:text-ink"
                        }`}
                      >
                        {k ?? "전체"}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </aside>
        )}

        {/* ⚠️⚠️ **[overflow-anchor:none] — 브라우저의 스크롤 보정을 끈다.**
            분류을 바꾸면 사라지는 사진을 앵커로 잡고 있던 브라우저가, 내
            `scrollTo` 가 끝난 **다음 프레임에** 스크롤을 혼자 끌어내렸다
            (위 pick 주석의 프레임 로그). 분류를 바꾸는 것은 **사용자가 시킨
            일**이라 어디를 볼지는 내가 정해야 하고, 브라우저가 옛 화면을
            붙잡아 둘 자리가 아니다.
            ⚠️ 끄는 것이 위험한 경우는 **스크롤 중에 위쪽 내용이 끼어들 때**다.
               이 격자는 칸마다 aspect-[3/2] 로 높이가 **미리 정해져** 있어
               사진이 늦게 와도 아래가 밀리지 않는다 — 끌 수 있는 조건이다.
            ⚠️ 바깥 칸과 <ul> **둘 다**에 건다. 앵커 후보는 격자 안의 사진들인데
               한 쪽만 끄면 다른 쪽이 후보로 남는다.
            Tailwind 에 유틸리티가 없어 임의 값으로 쓴다. */}
        <div
          ref={resultRef}
          className="min-w-0 flex-1 [overflow-anchor:none]"
        >
          {kinds && kinds.length > 1 && (
            /* 모바일용 칩. ⚠️ **숫자는 넣지 않는다**(제품 쪽에서도 뺐다). */
            <div className="mb-5 flex flex-wrap gap-2 lg:hidden">
              {[null, ...kinds].map((k) => {
                const active = filter === k;
                return (
                  <button
                    key={k ?? "전체"}
                    type="button"
                    aria-pressed={active}
                    onClick={() => pick(k)}
                    className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                      active
                        ? "border-brand bg-brand text-white"
                        : "border-line bg-white text-ink-soft hover:border-dark-soft/40 hover:text-ink"
                    }`}
                  >
                    {k ?? "전체"}
                  </button>
                );
              })}
            </div>
          )}

          {/* ⚠️ 리빌 래퍼는 `ul` **바깥**, `resultRef` **안쪽**이다. 분류
              스크롤이 재는 것은 resultRef 와 ul 이라 그 사이에 한 겹이
              끼어도 값이 달라지지 않는다 — 그래도 bug4.mjs 로 다시 잰다. */}
          <Group on={reveal}>
          <ul
            /* [overflow-anchor:none] — 바로 위 칸의 주석 참고. */
            className={`grid gap-2 [overflow-anchor:none] sm:gap-2.5 ${cols} ${className}`}
          >
            {shown.map((w, i) => (
          <li key={w.src}>
            <button
              type="button"
              onClick={(e) => {
                openerRef.current = e.currentTarget;
                setOpen(i);
              }}
              aria-label={`${w.alt} — 크게 보기`}
              className="group relative block aspect-[3/2] w-full overflow-hidden rounded-xl border border-line bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
            >
              {/* ⚠️⚠️ **사진이 오기 전 자리를 메우는 스켈레톤.** 유신이 짚었다 —
                  *"이미지 불러오기 전에 이게 뜨는데 … 로딩 애니메이션이 뜬다거나"*.
                  그림이 없을 때 브라우저가 `alt` 를 **글자로 그린다.**
                  ⚠️ 아래 Image 의 `text-transparent` 가 그 글자를 숨기고,
                     이 칸이 **옅은 회색 + 아주 느린 펄스**로 자리를 지킨다.
                     스크린리더는 `alt` 를 그대로 읽는다 — 눈에만 안 보인다.
                  ⚠️ 155칸에 상태를 하나씩 두지 않는다. **CSS 만으로** 한다 —
                     사진이 뜨면 그 위를 덮으므로 끌 필요가 없다. */}
              <span className="skeleton absolute inset-0 bg-line/60" aria-hidden />
              <Image
                src={w.src}
                alt={w.alt}
                width={1000}
                height={667}
                loading="lazy"
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                className="relative h-full w-full object-cover text-transparent transition-transform duration-500 group-hover:scale-[1.03]"
              />
              {/* ⚠️⚠️ **2026-10-19 — 한 줄로 자르고 말줄임을 붙인다.** 유신이
                  *"2줄 이상 넘어가는 제목은 ... 이렇게 뒤에 표시 하게 해서 1줄로
                  나오게 하면 될거 같고"* 라고 했고 보기까지 들었다 —
                  *"볼피더 · 직진피더 · 표면처리 이거 경우 2줄 인데
                  볼피더 · 직진피더... 예를 들면 이런식으로"*.

                  재 보니 기종 조합은 **열여덟 가지뿐**이고 그중 **여섯**이 두
                  줄로 접혔다(1440 · 1280 · 640 · 390 에서. 1024 · 768 · 500
                  에서는 안 접힌다). 칸은 aspect-[3/2] 고정인데 자막만 길어지니
                  **두 줄짜리 칸에서 사진이 그만큼 더 가려졌다.**

                  ⚠️ 잘린 글은 **크게보기에 그대로 다 뜬다.** 한 번 누르면
                     보이므로 정보가 사라지지 않는다. alt 도 온전하다.
                  ⚠️⚠️ **같은 클래스 문자열을 쓰는 곳이 둘 더 있다** —
                     ProductVideo.tsx 와 VideoCard.tsx 의 영상 자막이다.
                     그쪽은 **문장**이라(「구멍 뚫린 판금 브래킷이 트랙을 타고
                     한 방향으로 올라갑니다」) 자르면 뜻이 끊긴다. **거기엔
                     넣지 않았다.** 이 파일 머리 주석의 *"사진과 영상이 같은
                     말투여야 한다"* 는 **크기 · 색 · 그라데이션**을 말하는
                     것이고, 줄 수는 그 약속 밖이다 — 기종 이름은 목록이고
                     영상 자막은 문장이라 성격이 다르다.
                  ⚠️ 이 저장소에서 truncate 를 쓰는 **첫 자리**다. Tailwind v4
                     코어라 플러그인이 필요 없다(= overflow-hidden +
                     text-ellipsis + whitespace-nowrap). 바깥 띠가 inset-x-0
                     으로 폭을 주므로 바로 듣는다. */}
              <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-dark/85 via-dark/40 to-transparent px-3 pb-2.5 pt-8 text-left sm:px-4 sm:pb-3 sm:pt-10">
                <span className="block truncate text-13 font-medium leading-relaxed text-white sm:text-sm">
                  {w.kinds.join(" · ")}
                </span>
              </span>
                </button>
              </li>
            ))}
          </ul>
          </Group>
        </div>
      </div>

      {cur && mounted && createPortal(
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={cur.alt}
          onClick={close}
          /* ⚠️ 배경을 **거의 검정**으로 깐다. 사진 말고는 볼 것이 없어야 한다.
             ⚠️ 여는 전환은 **페이드 + 아주 작은 확대**다. 세로 이동은 쓰지
                않는다 — 스크롤 리빌에서 걷어낸 그 움직임이다.
                globals.css 의 prefers-reduced-motion 이 함께 꺼 준다. */
          className="lightbox fixed inset-0 z-[60] flex flex-col items-center justify-center bg-[#07090c]/[0.97] p-4 backdrop-blur-sm sm:p-10"
        >
          <button type="button" onClick={close} aria-label="닫기" className={`${ICON} absolute right-3 top-3 z-10 sm:right-6 sm:top-6`}>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>

          {shown.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); move(-1); }}
                aria-label="이전 사진"
                className={`${ICON} absolute left-1 z-10 sm:left-6`}
              >
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
                  <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); move(1); }}
                aria-label="다음 사진"
                className={`${ICON} absolute right-1 z-10 sm:right-6`}
              >
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
                  <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </>
          )}

          <figure onClick={(e) => e.stopPropagation()} className="flex max-h-full w-full max-w-5xl flex-col items-center">
            <Image
              key={cur.full}
              src={cur.full}
              alt={cur.alt}
              width={1600}
              height={1067}
              sizes="(min-width: 1024px) 64rem, 100vw"
              className="h-auto max-h-[76vh] w-auto max-w-full rounded-lg object-contain"
              priority
            />
            {/* ⚠️ 기종은 **배지**로 둔다. 글자만 있으면 *"텍스트만 있으니깐
                이상"* 했다. 테두리를 두르면 **덩어리로 보여** 길이가 달라도
                자리가 흔들리는 느낌이 없다.
                ⚠️⚠️ **번호를 이 배지 안으로 들였다.** 한 번 사진 위로 올렸다가
                   *"아래 봤다 위에 봤다 하면 불편"* 을 들었다. 처음 한 줄이었을
                   때는 *"글자 길이에 따라 위치가 왔다 갔다"* 였고 — **둘 다
                   맞는 말**이다. 한 배지 안에 넣으면 **테두리가 둘을 한 덩어리로
                   묶어** 길이가 변해도 흔들려 보이지 않으면서 눈도 한 번만
                   움직인다. 가운데 얇은 세로선이 둘을 가른다.
                ⚠️ 번호 색을 white/40 → **white/70** 으로 올렸다 —
                   *"글자가 너무 어두워서 잘 안보이네"*. */}
            <figcaption className="mt-5">
              <span className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/[0.07] px-4 py-1.5 text-13 backdrop-blur-sm sm:text-sm">
                <span className="font-medium text-white/90">{cur.kinds.join(" · ")}</span>
                <span className="h-3.5 w-px bg-white/20" aria-hidden />
                <span className="tabular-nums text-white/70">
                  {open! + 1} / {shown.length}
                </span>
              </span>
            </figcaption>
          </figure>
        </div>,
        document.body,
      )}
    </>
  );
}
