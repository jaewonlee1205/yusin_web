"use client";

import { useState } from "react";
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
 * 겉이 <button> 이라 키보드로도 재생된다. 자리는 aspect-video 로 미리 잡아
 * 두어 iframe 으로 바뀔 때 아래 내용이 밀리지 않는다.
 */
export default function VideoEmbed({ video }: { video: Video }) {
  const [playing, setPlaying] = useState(false);
  const watchUrl = `https://www.youtube.com/watch?v=${video.id}`;

  return (
    <div className="relative aspect-video overflow-hidden rounded-lg border border-line bg-black">
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
            src={`/images/videos/${video.id}.webp`}
            alt=""
            fill
            sizes="(min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-navy-deep/25 transition-colors group-hover:bg-navy-deep/10"
          />
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brand/95 shadow-lg transition-transform duration-300 group-hover:scale-110"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="ml-1 text-white"
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
