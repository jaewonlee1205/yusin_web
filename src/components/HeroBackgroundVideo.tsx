"use client";

import { useEffect, useState } from "react";

/**
 * 홈 히어로 배경에서 도는 영상. 소리 없고 누를 것도 없는 **장식**이다.
 *
 * ⚠️ 이 컴포넌트가 하는 일은 하나뿐이다 — **첫 화면이 다 그려진 뒤에
 *    영상을 받기 시작하는 것.** 모양은 page.tsx 가 정한다(바깥 겹의
 *    opacity-[0.3] 과 그 위 네이비 오버레이).
 *
 * 왜 미루는가 —
 *   이 영상은 1.59MB 다. 홈의 CSS · JS · 사진을 전부 합친 것(약 400KB)의
 *   네 배다. 그런데 바깥 겹이 opacity 0.3 이고 그 위에 네이비 오버레이가
 *   또 덮여 **거의 안 보인다.** 가장 무거운 파일이 가장 안 보이는 자리에
 *   있었고, 그 1.59MB 가 LCP 를 맡은 정지컷(hero-poster.webp, layout 이
 *   아니라 홈에서 preload fetchPriority="high" 로 받는다)과 대역을 다퉜다.
 *
 *   window load 뒤로 미루면 중요한 것이 다 끝난 뒤에 영상이 온다. 뒤에
 *   같은 장면 정지컷(page.tsx 의 Image priority)이 깔려 있어 **그 사이
 *   화면은 비지 않는다** — 영상이 그 위에 그대로 겹쳐 돌기 시작한다.
 *
 * ⚠️ '움직임 줄이기' 를 켠 사람에게는 아예 받지 않는다. globals.css 는
 *    .hero-video 를 display:none 으로 **숨기기만** 해서, 그대로 두면
 *    보이지도 않는 1.59MB 를 내려받았다. ProductVideo 와 같은 판단이다.
 *
 * ⚠️ IntersectionObserver 를 쓰지 않는다. 히어로는 첫 화면이라 언제나
 *    교차 상태이므로 관찰이 아무것도 미뤄 주지 않는다. 미뤄야 하는 기준이
 *    "화면에 들어왔나" 가 아니라 "첫 화면이 끝났나" 다.
 *
 * ⚠️ muted 가 없으면 자동재생이 막히고, playsInline 이 없으면 모바일에서
 *    전체화면으로 튄다. preload 는 auto 다 — 받기로 결정한 뒤에 부르므로
 *    아낄 이유가 없다(ProductVideo 도 같다).
 */
export default function HeroBackgroundVideo({
  src,
  poster,
}: {
  src: string;
  poster: string;
}) {
  const [load, setLoad] = useState(false);

  useEffect(() => {
    if (
      typeof matchMedia !== "undefined" &&
      matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    if (document.readyState === "complete") {
      setLoad(true);
      return;
    }

    const on = () => setLoad(true);
    window.addEventListener("load", on, { once: true });
    return () => window.removeEventListener("load", on);
  }, []);

  if (!load) return null;

  return (
    <video
      className="hero-video absolute inset-0 h-full w-full object-cover"
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
