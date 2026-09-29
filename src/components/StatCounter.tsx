"use client";

import { useEffect, useRef, useState } from "react";

/**
 * 0에서 목표값까지 올라가는 숫자.
 *
 * 연도(1992)처럼 세어 올리면 어색한 값에는 쓰지 않는다 — 그런 값은 count={false}로
 * 넘기면 그냥 그대로 보여 준다.
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
  const [shown, setShown] = useState(count ? 0 : value);
  const started = useRef(false);

  useEffect(() => {
    if (!count) return;

    const reduce =
      typeof matchMedia !== "undefined" &&
      matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setShown(value);
      return;
    }

    if (started.current) return;
    started.current = true;

    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      // 끝으로 갈수록 느려지게
      const eased = 1 - Math.pow(1 - p, 3);
      setShown(Math.round(value * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [count, value, duration]);

  return (
    <span className={className} suppressHydrationWarning>
      {shown}
    </span>
  );
}
