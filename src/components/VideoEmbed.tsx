"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Video } from "@/data/videos";

/**
 * 유튜브 영상 한 편. iframe 을 처음부터 박아 두지 않는다.
 *
 * 썸네일과 재생 버튼만 먼저 그리고, 누를 때 iframe 으로 바꾼다. 홈에 iframe 이
 * 항상 떠 있으면 페이지를 열기만 해도 유튜브 스크립트와 쿠키 요청이 따라붙는다.
 * 썸네일은 public/images/videos/ 에 받아 둔 것이라, 누르기 전까지 유튜브로
 * 나가는 요청이 하나도 없다.
 *
 * preview 를 켜면(홈 '제품 영상' 섹션) 그 자리에 들어왔을 때 소리 없는
 * 미리보기가 저절로 돈다. 이때도 페이지를 열자마자 붙지는 않는다 —
 * IntersectionObserver 로 그 섹션까지 내려와야 iframe 을 만든다. 위 문단의
 * 이유를 그대로 지키려는 것이다.
 *
 * 겉이 <button> 이라 키보드로도 재생된다. 자리는 aspect-video 로 미리 잡아
 * 두어 iframe 으로 바뀔 때 아래 내용이 밀리지 않는다.
 *
 * 이 컴포넌트는 VideoCard 안에서만 쓴다. 테두리.모서리.바탕(흰색)은 그쪽이
 * 맡고 여기는 화면만 책임진다.
 */
export default function VideoEmbed({
  video,
  /** 화면에 들어오면 소리 없이 자동으로 돌린다 */
  preview = false,
}: {
  video: Video;
  preview?: boolean;
}) {
  /** 소리.컨트롤이 있는 정식 재생. 버튼을 눌러야 켜진다 */
  const [playing, setPlaying] = useState(false);
  /** 미리보기 iframe 을 붙여도 되는 때가 됐는가 */
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const watchUrl = `https://www.youtube.com/watch?v=${video.id}`;

  // Reveal 과 같은 패턴이다. 한 번 들어오면 관찰을 끊는다 — 오르내릴 때마다
  // iframe 을 다시 만들 이유가 없다.
  useEffect(() => {
    if (!preview) return;
    const el = ref.current;
    if (!el) return;

    // IntersectionObserver 가 없으면 미리보기를 걸지 않는다. 썸네일과 재생
    // 버튼이 그대로 남으므로 기능이 사라지지는 않는다.
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
  }, [preview]);

  const showPreview = preview && inView && !playing;

  // 테두리와 둥근 모서리는 감싸는 VideoCard 가 가진다 — 여기서도 주면 카드
  // 안에 선이 두 겹으로 보인다. aspect-video 는 남긴다: 재생 전에 자리를 잡아
  // 둬야 iframe 으로 바뀔 때 아래가 밀리지 않는다.
  return (
    <div ref={ref} className="relative aspect-video overflow-hidden bg-black">
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
        <>
          {/* 썸네일은 미리보기가 붙은 뒤에도 아래에 남는다. 자동재생을 막는
              브라우저(모바일 일부)에서 유튜브가 멈춘 채 떠도 그림이 비치고,
              iframe 이 뜨는 찰나에 검은 칸이 보이지 않는다. */}
          <Image
            src={`/images/videos/${video.id}.webp`}
            alt=""
            fill
            sizes="(min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />

          {showPreview && (
            // 소리 없는 미리보기. loop 은 playlist 에 같은 id 를 줘야 돈다.
            // controls.disablekb 를 끈 것은 이 iframe 이 조작 대상이 아니기
            // 때문이다 — 누르는 일은 위에 덮인 버튼이 맡는다.
            <iframe
              src={
                `https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&mute=1` +
                `&loop=1&playlist=${video.id}&controls=0&modestbranding=1&rel=0` +
                `&playsinline=1&disablekb=1`
              }
              title={`${video.title} 미리보기`}
              aria-hidden="true"
              tabIndex={-1}
              allow="autoplay; encrypted-media"
              className="pointer-events-none absolute inset-0 h-full w-full"
            />
          )}

          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`${video.title} 영상 재생`}
            className="group absolute inset-0 h-full w-full cursor-pointer"
          >
            {/* 어두운 겹. 미리보기가 도는 동안에는 영상을 가리지 않도록
                호버.포커스에서만 덮는다. */}
            <span
              aria-hidden="true"
              className={
                showPreview
                  ? "absolute inset-0 bg-navy-deep/0 transition-colors group-hover:bg-navy-deep/25 group-focus-visible:bg-navy-deep/25"
                  : "absolute inset-0 bg-navy-deep/25 transition-colors group-hover:bg-navy-deep/10"
              }
            />
            {/* 맨 위로 버튼(BackToTop)과 같은 언어다 — rounded-full + bg-white
                + text-ink + shadow-card. 전에는 64px 브랜드 레드 원이었는데,
                레드 원은 유튜브 자체의 재생 버튼과 겹쳐 보이고 이 사이트에서
                레드는 강조 한 점에만 쓰는 색이다.

                흰 원이 밝은 썸네일 위에서도 보이는 것은 바로 위의 어두운
                겹(navy-deep/25) 덕이다. 그 겹을 지우면 원이 묻힌다.

                미리보기가 도는 동안에는 숨긴다 — 이미 영상이 보이는데 재생
                버튼이 가운데 떠 있으면 무엇을 누르라는 것인지 흐려진다.
                호버.포커스하면 다시 나타나 "눌러서 소리까지" 를 알린다.

                호버 확대는 1.1 에서 1.06 으로 줄였다. */}
            <span
              aria-hidden="true"
              className={`absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-ink shadow-card backdrop-blur-sm transition duration-200 group-hover:scale-[1.06] group-hover:bg-white ${
                showPreview
                  ? "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
                  : ""
              }`}
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
        </>
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
