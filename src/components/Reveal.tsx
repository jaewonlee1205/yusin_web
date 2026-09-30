"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * 화면에 들어올 때 아래에서 올라오며 나타난다.
 *
 * 한 번 나타나면 관찰을 끊는다 — 스크롤을 오르내릴 때마다 다시 움직이면
 * 정보를 읽으러 온 방문자에게 방해가 된다.
 *
 * 움직임 최소화 설정과 JS 차단 환경 대비는 globals.css / layout.tsx에서 처리한다.
 */
export default function Reveal({
  children,
  /** 여러 개를 차례로 올릴 때 주는 지연(ms) */
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  /** aside 는 경영이념 패널용 — 래퍼 div 를 덧대면 그리드 칸이 바뀐다 */
  as?: "div" | "li" | "section" | "aside";
}) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // IntersectionObserver가 없는 환경에서는 그냥 보여 준다.
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShown(true);
        io.disconnect();
      },
      // 화면에 완전히 들어오기 조금 전에 시작해야 자연스럽다.
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as never}
      className={`reveal ${shown ? "is-visible" : ""} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
