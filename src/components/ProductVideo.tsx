"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Reveal from "./Reveal";

/**
 * 제품 상세 "구동 영상" 한 편. 소리 없이 저절로 도는 장식 영상이다.
 *
 * 누를 것이 없다 — 재생 버튼도, 호버 반응도. 홈 미리보기(VideoEmbed 의
 * preview 모드)와 같은 규칙이고, 그 파일 머리 주석에 내력이 있다.
 *
 * VideoEmbed 를 쓰지 않는 이유: 그쪽은 유튜브 Video 타입(id + 썸네일)을
 * 받고 유튜브 파사드까지 함께 들고 있다. 여기는 로컬 mp4 한 개뿐이라
 * 그 절반이 죽은 코드가 된다.
 *
 * ⚠️ Image 와 .hero-video 는 짝이다. globals.css 가 '움직임 줄이기' 에서
 *    .hero-video 를 display:none 으로 숨기므로, 그 사람에게는 뒤에 깔린
 *    정지컷이 보인다. 둘 중 하나만 두지 말 것.
 */
export default function ProductVideo({
  video,
}: {
  video: { src: string; poster: string; note: string };
}) {
  const [load, setLoad] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // ⚠️ '움직임 줄이기' 를 켠 사람에게는 아예 받지 않는다. globals.css 는
    //    .hero-video 를 display:none 으로 **숨기기만** 해서, 그대로 두면
    //    보이지도 않는 파일을 내려받는다. 정지컷은 아래 Image 가 맡는다.
    if (
      typeof matchMedia !== "undefined" &&
      matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      setLoad(true);
      return;
    }

    // ⚠️ rootMargin 아래쪽이 **양수**다. 화면에 닿기 400px 전에 받기
    //    시작한다 — 보통 스크롤 속도로 0.3~0.5초 먼저다.
    //    음수로 두면(한때 "0px 0px -10% 0px" 였다) 요소가 이미 보이고
    //    20% 가 들어온 뒤에야 받기 시작해, 첫 스크롤에서 멈칫한다.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setLoad(true);
        io.disconnect();
      },
      { rootMargin: "0px 0px 400px 0px", threshold: 0 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Reveal>
      <div
        ref={ref}
        className="relative aspect-video overflow-hidden rounded-2xl bg-surface lg:aspect-[3/1]"
      >
        <Image
          src={video.poster}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
        {load && (
          <video
            className="hero-video absolute inset-0 h-full w-full object-cover"
            poster={video.poster}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          >
            <source src={video.src} type="video/mp4" />
          </video>
        )}
      </div>
      <p className="mt-4 text-sm leading-relaxed text-muted">{video.note}</p>
    </Reveal>
  );
}
