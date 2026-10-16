"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Work } from "@/data/works";

/**
 * 납품 설비 사진 — 격자와 크게보기.
 *
 * ⚠️⚠️ **격자까지 이 안에 들어 있다.** 처음에는 격자(서버)와 크게보기(클라이언트)를
 *    가르려 했는데, 칸을 누르면 열리는 구조라 **칸 자체가 클라이언트여야 한다.**
 *    가르면 서버 격자가 클라이언트 칸을 감싸는 꼴이 되어 얻는 것이 없다.
 *    ⚠️ 그래서 **`works.ts` 만 서버에서 넘겨받는다** — 31장 목록은 번들이 아니라
 *       페이지 HTML 로 간다.
 *
 * ⚠️ 사진은 **두 벌**이다(`works.ts` 주석 참고). 격자는 `src`(1000px),
 *    크게보기는 `full`(1800px). **열 때만** 큰 것을 받는다 —
 *    `output: "export"` 라 Next.js 가 리사이즈해 주지 않기 때문이다.
 *
 * ⚠️ 자막 띠는 `ProductVideo` 의 것과 **같은 값**을 쓴다
 *    (`from-dark/85 via-dark/40 to-transparent`). 사이트 안에서 사진과 영상이
 *    같은 말투여야 한다.
 */
export default function PhotoLightbox({
  items,
  className = "",
}: {
  items: Work[];
  className?: string;
}) {
  const [open, setOpen] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);

  /* ⚠️⚠️ **크게보기는 포털로 `body` 에 붙인다.** 처음에는 그냥 `fixed z-50` 으로
     두었는데 **헤더가 그 위에 떴다.** 헤더도 `z-50` 이고 `sticky` 라 **자기
     쌓임 맥락**을 만드는데, 크게보기는 Section 안에 있어 **그 맥락에 갇힌다** —
     z-index 를 아무리 올려도 밖으로 못 나간다.
     ⚠️ 포털은 서버에서 렌더할 수 없으므로 **마운트된 뒤에만** 쓴다. */
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const close = useCallback(() => {
    setOpen(null);
    // 열었던 칸으로 포커스를 돌려준다 — 키보드로 보던 사람이 길을 잃지 않게
    openerRef.current?.focus();
  }, []);

  const move = useCallback(
    (d: number) => setOpen((i) => (i === null ? null : (i + d + items.length) % items.length)),
    [items.length],
  );

  useEffect(() => {
    if (open === null) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") move(1);
      else if (e.key === "ArrowLeft") move(-1);
      else if (e.key === "Tab") {
        // 포커스를 가둔다
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

    /* ⚠️ 배경 스크롤을 잠근다. 안 잠그면 크게 띄워 둔 채 뒤가 움직여
       닫았을 때 엉뚱한 자리에 서 있게 된다.
       ⚠️ 스크롤막대가 사라지며 폭이 바뀌어 **내용이 옆으로 튀는 것**을
          padding 으로 막는다. */
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

  const cur = open === null ? null : items[open];

  return (
    <>
      <ul
        className={`grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-2.5 lg:grid-cols-4 ${className}`}
      >
        {items.map((w, i) => (
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
              {/* 자막 — ProductVideo 와 같은 그라데이션·같은 글자 크기 */}
              <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-dark/85 via-dark/40 to-transparent px-3 pb-2.5 pt-8 text-left sm:px-4 sm:pb-3 sm:pt-10">
                <span className="block text-13 font-medium leading-relaxed text-white sm:text-sm">
                  {w.kind}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      {cur && mounted && createPortal(
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={cur.alt}
          onClick={close}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-dark/95 p-4 sm:p-8"
        >
          {/* 닫기 — 오른쪽 위 */}
          <button
            type="button"
            onClick={close}
            aria-label="닫기"
            className="absolute right-3 top-3 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:right-5 sm:top-5"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>

          {items.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); move(-1); }}
                aria-label="이전 사진"
                className="absolute left-2 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:left-5"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
                  <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); move(1); }}
                aria-label="다음 사진"
                className="absolute right-2 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:right-5"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
                  <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </>
          )}

          {/* 사진 — 배경을 눌러 닫으므로 여기서는 전파를 막는다 */}
          <figure
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-full w-full max-w-5xl"
          >
            <Image
              key={cur.full}
              src={cur.full}
              alt={cur.alt}
              width={1800}
              height={1200}
              sizes="(min-width: 1024px) 64rem, 100vw"
              className="h-auto max-h-[78vh] w-full rounded-xl object-contain"
              priority
            />
            <figcaption className="mt-3 flex items-center justify-between gap-4 text-13 text-white/80 sm:text-sm">
              <span className="font-medium text-white">{cur.kind}</span>
              <span className="tabular-nums text-white/60">
                {open! + 1} / {items.length}
              </span>
            </figcaption>
          </figure>
        </div>,
        document.body,
      )}
    </>
  );
}
