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

        {/* 설명은 영상 위 하단에 겹친다. 한때 영상 아래 회색 한 줄이었는데,
            큰 영상 다음에 작은 글씨가 왼쪽에 홀로 떠 글과 그림이 따로 놀았다.

            ⚠️ <video> 가 아니라 **칸**의 자식이다. 그래야 '움직임 줄이기' 에서
               영상이 display:none 이 되어도 뒤에 깔린 정지컷 위에 설명이
               그대로 남는다.

            ⚠️ 흰 글씨가 읽히는 것은 그라데이션 덕이다. 일곱 편의 하단 22%
               띠 밝기를 재니 Y 89.9~116.4 였고(가장 밝은 것이 방음커버),
               거기에 navy-deep/85 를 덮으면 Y 29 로 떨어져 흰 글씨 대비가
               약 16:1 이 된다(AAA 7:1 의 두 배). 영상이 돌아도 그 띠 안의
               최대-최소 차이가 27 뿐이라 흔들리지 않는다.
               영상을 갈아 끼울 때 하단이 더 밝으면 다시 잰다.

            pointer-events-none — 누를 것이 없는 장식 영상이라 마우스를
            가로채지 않는다. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-deep/85 via-navy-deep/40 to-transparent px-5 pb-5 pt-12 sm:px-6 sm:pb-6">
          <p className="text-[13px] font-medium leading-relaxed text-white sm:text-sm">
            {video.note}
          </p>
        </div>
      </div>
    </Reveal>
  );
}
