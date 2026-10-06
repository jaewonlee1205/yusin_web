"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Video } from "@/data/videos";

/**
 * 영상 한 편. 쓰이는 자리가 둘이고 하는 일이 다르다.
 *
 * ── preview (홈 '제품 영상') ─────────────────────────────────────────
 * 누를 것이 없는 **장식 영상**이다. 소리 없는 로컬 mp4 가 저절로 돌고,
 * 재생 버튼도 호버 반응도 없다 — 히어로.PERFORMANCE 영상과 같은 꼴이다.
 * 유튜브로 가는 길은 섹션의 "영상 전체 보기" 버튼과 /videos 가 맡는다.
 *
 *   ⚠️ 여기에 버튼을 다시 붙이지 말 것. 한때 미리보기 위에 재생 버튼을
 *      덮어 두었는데, 스크롤로 섹션에 닿기 전까지 버튼이 보이다가 영상이
 *      시작돼 "버튼을 눌러야 재생되는 것" 처럼 읽혔고, 마우스를 올리면
 *      어두운 겹과 흰 원이 떠서 바로 위 PERFORMANCE 영상과 결이 갈렸다.
 *
 *   ⚠️ 그 전에는 유튜브 임베드에 autoplay&mute&loop&controls=0 을 걸어
 *      미리보기를 만들었다. 파라미터로 UI 를 아무리 눌러도 플레이어 자체의
 *      결(로딩 화면, 루프 이음매, 화질 전환)이 남아 "유튜브 미리보기" 로
 *      보였다.
 *
 * ── 그 밖 (/videos) ──────────────────────────────────────────────────
 * 유튜브 파사드다. 썸네일과 재생 버튼만 먼저 그리고, 누를 때 iframe 으로
 * 바꾼다. iframe 을 처음부터 박아 두면 페이지를 열기만 해도 유튜브 스크립트와
 * 쿠키 요청이 따라붙는다. 썸네일은 public/images/videos/ 에 받아 둔 것이라,
 * 누르기 전까지 유튜브로 나가는 요청이 하나도 없다.
 *
 * 어느 쪽이든 자리는 aspect-video 로 미리 잡아 둔다 — 영상.iframe 으로 바뀔
 * 때 아래 내용이 밀리지 않는다. 테두리.모서리.바탕(흰색)은 감싸는 VideoCard
 * 가 맡고 여기는 화면만 책임진다.
 */
export default function VideoEmbed({
  video,
  /** 홈 전용 — 버튼 없는 장식 영상으로 돌린다 (video.preview 가 있을 때만) */
  preview = false,
}: {
  video: Video;
  preview?: boolean;
}) {
  /** 소리.컨트롤이 있는 유튜브 정식 재생. 버튼을 눌러야 켜진다 */
  const [playing, setPlaying] = useState(false);
  /** 미리보기 mp4 를 받아도 되는 때가 됐는가 */
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isPreview = preview && !!video.preview;
  const watchUrl = `https://www.youtube.com/watch?v=${video.id}`;
  const poster = `/images/videos/${video.id}.webp`;

  // Reveal 과 같은 패턴이다. 한 번 들어오면 관찰을 끊는다 — 오르내릴 때마다
  // 영상을 다시 받을 이유가 없다.
  useEffect(() => {
    if (!isPreview) return;
    const el = ref.current;
    if (!el) return;

    // IntersectionObserver 가 없으면 영상을 걸지 않는다. 아래 썸네일이
    // 그대로 남으므로 빈 칸이 되지는 않는다.
    if (typeof IntersectionObserver === "undefined") return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setInView(true);
        io.disconnect();
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.2 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [isPreview]);

  /* ── 홈: 장식 영상 ──────────────────────────────────────────────── */
  if (isPreview) {
    return (
      <div ref={ref} className="relative aspect-video overflow-hidden bg-black">
        {/* 영상이 받아지는 동안 검은 칸이 보이지 않게 깔아 둔다. 아래
            <video> 가 숨겨지는 '움직임 줄이기' 설정에서도 이 그림이 남는다. */}
        <Image
          src={poster}
          alt=""
          fill
          sizes="(min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />

        {inView && (
          // hero-video 클래스를 그대로 쓴다 — globals.css 의
          // prefers-reduced-motion 블록이 이 클래스를 display:none 으로
          // 숨긴다(히어로.PERFORMANCE 영상과 같은 처리다).
          //
          // poster 가 위 Image 와 같은 파일이라 썸네일에서 영상으로 바뀌는
          // 순간이 보이지 않는다.
          <video
            className="hero-video absolute inset-0 h-full w-full object-cover"
            poster={poster}
            autoPlay
            muted
            loop
            playsInline
            preload="none"
          >
            <source src={video.preview} type="video/mp4" />
          </video>
        )}
      </div>
    );
  }

  /* ── /videos: 유튜브 파사드 ─────────────────────────────────────── */
  return (
    <div className="relative aspect-video overflow-hidden bg-black">
      {playing ? (
        <iframe
          // autoplay=1 — 누르는 동작 자체가 재생 의사라 한 번 더 누르게 하지 않는다.
          src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`${video.title} 영상 재생`}
          className="group absolute inset-0 h-full w-full cursor-pointer"
        >
          <Image
            src={poster}
            alt=""
            fill
            sizes="(min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-navy-deep/25 transition-colors group-hover:bg-navy-deep/10"
          />
          {/* 맨 위로 버튼(BackToTop)과 같은 언어다 — rounded-full + bg-white
              + text-ink + shadow-card. 전에는 64px 브랜드 레드 원이었는데,
              레드 원은 유튜브 자체의 재생 버튼과 겹쳐 보이고 이 사이트에서
              레드는 강조 한 점에만 쓰는 색이다.

              흰 원이 밝은 썸네일 위에서도 보이는 것은 바로 위의 어두운
              겹(navy-deep/25) 덕이다. 그 겹을 지우면 원이 묻힌다.

              호버 확대는 1.1 에서 1.06 으로 줄였다. */}
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-ink shadow-card backdrop-blur-sm transition duration-200 group-hover:scale-[1.06] group-hover:bg-white"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="ml-0.5"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>
      )}

      {/* 스크립트가 꺼져 있으면 유튜브로 보낸다 */}
      <noscript>
        <a
          href={watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 flex items-end bg-navy-deep/40 p-4 text-sm font-semibold text-white"
        >
          {video.title} — 유튜브에서 보기
        </a>
      </noscript>
    </div>
  );
}
