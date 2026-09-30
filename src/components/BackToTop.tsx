"use client";

import { useEffect, useState } from "react";
import { ChevronUpIcon } from "./icons";

/** 맨 위까지 올라가는 데 걸리는 시간(ms). */
const DURATION = 450;

/** 이만큼 내려가면 버튼을 띄운다. 한 화면쯤 지나 "꽤 내려왔다" 싶은 지점. */
const SHOW_AFTER = 600;

/**
 * 맨 위로 올려 주는 버튼.
 *
 * 페이지를 옮길 때는 글자를 올리며 들여보내지 않는다(PageHero 참고).
 * 대신 위로 돌아갈 때만 움직임을 준다 — 누른 사람이 스스로 시킨 움직임이라
 * 기다린다는 느낌이 없다.
 *
 * 안 보일 때는 초점도 받지 않게 한다. 그러지 않으면 화면에 없는 버튼에
 * Tab 이 걸려 키보드로 훑는 사람이 헤맨다.
 */
export default function BackToTop() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > SHOW_AFTER);
    onScroll(); // 새로고침으로 중간에서 시작할 수도 있다
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toTop = () => {
    // 움직임을 줄여 둔 환경에서는 부드럽게 올리지 않고 바로 올린다.
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce) {
      window.scrollTo(0, 0);
      return;
    }

    // scrollTo({ behavior: "smooth" }) 를 쓰지 않고 직접 올린다.
    // 그 한 줄은 부드러움이 브라우저 안에 있어 어떤 곡선으로 움직이는지
    // 밖에서 확인할 길이 없고, 측정 환경에서는 옵션을 무시한 채 아예
    // 움직이지 않았다. 직접 올리면 어디서나 같게 동작하고 곡선도 짚인다.
    const start = window.scrollY;
    const t0 = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - t0) / DURATION);
      // easeOutCubic — 처음 빠르고 끝에서 부드럽게 멎는다
      const eased = 1 - Math.pow(1 - t, 3);
      window.scrollTo(0, Math.round(start * (1 - eased)));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label="맨 위로"
      aria-hidden={!shown}
      tabIndex={shown ? 0 : -1}
      className={`fixed bottom-5 right-5 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-navy text-white shadow-lg transition-all duration-300 hover:bg-navy-deep sm:bottom-7 sm:right-7 ${
        shown ? "opacity-100" : "pointer-events-none translate-y-2 opacity-0"
      }`}
    >
      <ChevronUpIcon />
    </button>
  );
}
