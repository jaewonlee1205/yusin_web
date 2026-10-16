"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Work } from "@/data/works";

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
  className = "",
}: {
  items: Work[];
  /** 분류 버튼에 쓸 기종. 안 주면 버튼을 내지 않는다(홈). */
  kinds?: string[];
  className?: string;
}) {
  const [filter, setFilter] = useState<string | null>(null);
  const [open, setOpen] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);

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
              <p className="bg-dark-soft px-5 py-3.5 text-xs font-bold tracking-[0.08em] text-white">
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
                        onClick={() => {
                          setFilter(k);
                          setOpen(null);
                        }}
                        className={`flex w-full items-center gap-2 px-5 py-3 text-left text-sm transition-colors ${
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

        <div className="min-w-0 flex-1">
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
                    onClick={() => {
                      setFilter(k);
                      setOpen(null);
                    }}
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

          <ul
            className={`grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-2.5 lg:grid-cols-3 xl:grid-cols-4 ${className}`}
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
              <Image
                src={w.src}
                alt={w.alt}
                width={1000}
                height={667}
                loading="lazy"
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-dark/85 via-dark/40 to-transparent px-3 pb-2.5 pt-8 text-left sm:px-4 sm:pb-3 sm:pt-10">
                <span className="block text-13 font-medium leading-relaxed text-white sm:text-sm">
                  {w.kinds.join(" + ")}
                </span>
              </span>
                </button>
              </li>
            ))}
          </ul>
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

          {/* ⚠️⚠️ **번호를 사진 위로 올렸다.** 유신이 짚었다 — *"글자가 짧고
              긴거에 따라 **텍스트 위치가 왔다 갔다** 하는 것도 디자인적으로
              이상해"*. 번호와 기종이 **한 줄에 있으니** 기종이 길어질 때마다
              번호가 밀렸다. 위아래로 떼면 서로 영향이 없다. */}
          <p className="pointer-events-none absolute top-5 left-1/2 -translate-x-1/2 text-13 tabular-nums text-white/40 sm:top-7">
            {open! + 1} / {shown.length}
          </p>

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
                자리가 흔들리는 느낌이 없다. */}
            <figcaption className="mt-5">
              <span className="inline-flex items-center rounded-full border border-white/15 bg-white/[0.07] px-4 py-1.5 text-13 font-medium text-white/90 backdrop-blur-sm sm:text-sm">
                {cur.kinds.join(" + ")}
              </span>
            </figcaption>
          </figure>
        </div>,
        document.body,
      )}
    </>
  );
}
