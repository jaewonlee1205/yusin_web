"use client";

import { useEffect, useState } from "react";

/**
 * 히어로 하단의 "아래로 스크롤하세요" 표시.
 *
 * ⚠️⚠️ **지표 띠의 위 경계선 자리에 얹힌다.** -top-px h-px 로 띠의
 *    border-t 를 덮고 좌에서 우로 가는 빛줄이 지나간다.
 *
 *    한때 히어로 가운데 아래에 **세로선**으로 서 있었다. 바로 위가 진동기
 *    라인업이라 "진동기에 방해된다" 는 말을 들었고, 자리를 비우려고 Container
 *    에 아래 여백(pb-*)까지 잡아먹고 있었다. 지금은 **그 여백이 필요 없다** —
 *    띠의 경계선을 쓰므로 진동기 영역을 전혀 건드리지 않는다.
 *
 * ⚠️ 옛 메모(세로선 시절):
 *    이 표시는 absolute 라 높이를 더하지 않으므로, 쓰는 쪽에서 자리를 만들어
 *    주지 않으면 아래 내용과 겹친다 — 2026-10-14 에 진동기 이름표와 겹쳐
 *    통째로 걷었다가 되살린 적이 있다.
 *    page.tsx 의 Container 가 lg:[@media(min-height:701px)]:pb-32 로
 *    여백을 비운다. 표시가 쓰는 높이는 **선 44px + bottom-3 12px = 56px** 다
 *    (글자를 걷기 전에는 64px 였다).
 *    **표시가 보이는 조건과 똑같은 조건**이어야 한다.
 *    ⚠️ sm(640)이 아니라 **lg(1024)부터**다 — 768x1024 에서 128px 를
 *       비우느라 히어로가 83px 넘쳤다. 태블릿에는 표시가 없어도 된다.
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
      className={`pointer-events-none absolute inset-x-0 -top-px h-px overflow-hidden transition-opacity duration-500 ${
        hidden ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* ⚠️ **글자가 없다. 움직이는 선뿐이다.** "SCROLL 문구는 지우고
             애니메이션만" 이라는 요청에 걷었다. 되살리지 말 것.
             aria-hidden 장식이라 접근성에 영향이 없다. */}
      <span className="cue-line-x block h-px w-1/5 bg-gradient-to-r from-transparent via-white/70 to-transparent" />
    </div>
  );
}
