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
      /* ⚠️⚠️ `onClick={scrollToTop}` 으로 바로 넘기면 **이벤트 객체가 첫 인자로
         들어간다.** 2026-10-16 에 scrollToTop 이 `instant` 를 받게 되면서,
         MouseEvent 가 truthy 라 이 버튼까지 **즉시 이동**이 돼 버렸다
         (타입 검사가 잡았다). 이 버튼은 「올려 달라」는 요청이고 **움직임
         자체가 응답**이라 부드럽게 올라가야 한다. 괄호로 감싸 끊어 둔다. */
      onClick={() => scrollToTop()}
      aria-label="맨 위로"
      aria-hidden={!shown}
      tabIndex={shown ? 0 : -1}
      /* ⚠️ active:duration-75 를 함께 준다. 이 버튼의 duration-300 은
         나타났다 사라지는 연출용인데, 그 값으로 누름 반응까지 그리면
         손가락을 떼고도 한참 뒤에 돌아온다. 누르는 동안만 빠르게. */
      className={`fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-white text-ink shadow-card ring-1 ring-ink/5 transition-all duration-300 hover:bg-surface active:scale-95 active:duration-75 sm:bottom-7 sm:right-7 ${
        shown ? "opacity-100" : "pointer-events-none translate-y-2 opacity-0"
      }`}
    >
      <ChevronUpIcon />
    </button>
  );
}
