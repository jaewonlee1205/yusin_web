"use client";

import { useEffect, useLayoutEffect, useState } from "react";

/**
 * 서버에서는 useLayoutEffect가 경고를 내므로 브라우저에서만 쓴다.
 */
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

/** 지표가 .rise 로 나타나기까지 걸리는 시간(ms). globals.css / page.tsx 와 맞춰 둔다. */
const FADE_IN_WINDOW_MS = 800;

function prefersReducedMotion() {
  return (
    typeof matchMedia !== "undefined" &&
    matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * 0에서 목표값까지 올라가는 숫자.
 *
 * 연도(1992)처럼 세어 올리면 어색한 값에는 쓰지 않는다 — count={false}로 넘기면
 * 그냥 그대로 보여 준다.
 *
 * 두 가지를 지킨다.
 *  1. **서버가 내보내는 HTML에는 최종값이 들어간다.** JS가 막히거나 늦어도
 *     방문자와 검색엔진이 "0개사" 같은 틀린 숫자를 보면 안 된다.
 *     화면에 그려지기 전(useLayoutEffect)에 0으로 되돌리므로 깜빡이지 않는다.
 *  2. **어떤 경우에도 0에 머물지 않는다.** rAF가 멈춘 채 남을 수 있어
 *     (배경 탭에서 열어 둔 경우 등) 최종값을 넣는 타이머를 함께 건다.
 *
 * 개발 모드의 StrictMode는 effect를 두 번 실행한다. 여기서는 가드를 두지 않아
 * 애니메이션이 처음부터 다시 돌 뿐이고 스스로 회복된다.
 */
export default function StatCounter({
  value,
  count = true,
  duration = 1200,
  className = "",
}: {
  value: number;
  count?: boolean;
  duration?: number;
  className?: string;
}) {
  const [shown, setShown] = useState(value);

  useIsomorphicLayoutEffect(() => {
    if (!count || prefersReducedMotion()) return;

    // 지표 줄은 .rise 의 지연(최대 670ms) 동안 화면에 보이지 않는다.
    // 그 창 안에 하이드레이션이 끝났다면 아무도 못 보는 사이에 0으로 되돌릴 수 있다.
    // 느린 회선 등으로 이미 숫자가 떠 있는 뒤라면 그대로 둔다 —
    // 34가 보이다가 0으로 튀는 쪽이 훨씬 어색하다.
    if (performance.now() > FADE_IN_WINDOW_MS) return;

    setShown(0);
  }, [count]);

  useEffect(() => {
    if (!count || prefersReducedMotion()) return;

    let raf = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      // 끝으로 갈수록 느려지게
      const eased = 1 - Math.pow(1 - progress, 3);
      setShown(Math.round(value * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    const settle = setTimeout(() => setShown(value), duration + 600);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(settle);
    };
  }, [count, value, duration]);

  return <span className={className}>{shown}</span>;
}
