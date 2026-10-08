"use client";

import { useEffect, useState } from "react";

/**
 * 히어로 하단의 "아래로 스크롤하세요" 표시.
 *
 * absolute로 띄워 레이아웃 높이에 전혀 영향을 주지 않는다.
 * 히어로가 화면에 딱 맞게 짜여 있어서 높이를 한 픽셀이라도 더하면 안 된다.
 *
 * 화면이 낮거나(모바일 포함) 자리가 없을 때는 숨긴다.
 */
export default function ScrollCue() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    // 조금이라도 내리면 역할이 끝났으므로 사라진다.
    const onScroll = () => setHidden(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 bottom-3 hidden justify-center transition-opacity duration-500 sm:flex [@media(max-height:700px)]:!hidden ${
        hidden ? "opacity-0" : "opacity-100"
      }`}
    >
      <span className="flex flex-col items-center gap-2">
        <span className="text-10 font-bold uppercase tracking-[0.3em] text-white/45">
          Scroll
        </span>
        <span className="relative block h-8 w-px overflow-hidden bg-white/15">
          <span className="cue-line absolute inset-0 block bg-white/70" />
        </span>
      </span>
    </div>
  );
}
