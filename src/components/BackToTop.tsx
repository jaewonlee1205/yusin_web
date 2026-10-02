"use client";

import { useEffect, useState } from "react";
import { ChevronUpIcon } from "./icons";
import { scrollToTop } from "@/lib/scrollToTop";

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

  return (
    <button
      type="button"
      onClick={scrollToTop}
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
