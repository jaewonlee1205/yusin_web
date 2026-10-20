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
 * 파사드다. 정지컷과 재생 버튼만 먼저 그리고, 누를 때 비로소 영상을 건다.
 * iframe 을 처음부터 박아 두면 페이지를 열기만 해도 유튜브 스크립트와
 * 쿠키 요청이 따라붙는다. 썸네일은 public/images/videos/ 에 받아 둔 것이라,
 * 누르기 전까지 유튜브로 나가는 요청이 하나도 없다.
 *
 * ⚠️⚠️ **2026-10-19 — 누른 뒤가 둘로 갈린다.** /videos 가 제품 구동 영상
 *    일곱(로컬 mp4)까지 함께 걸게 되면서다(videoLibrary.ts).
 *
 *      video.src 있음   그 자리에서 <video controls> 로 돈다
 *      없음             지금까지처럼 youtube-nocookie iframe
 *
 *    **누르기 전은 열둘이 똑같다** — 정지컷 + 흰 재생 원. 한쪽만 저절로
 *    돌면 videos.ts(featuredVideos 주석)가 경고한 그 꼴이 된다. 즉
 *    "하나는 영상이 돌고 하나는 멈춘 썸네일" 로 나란히 서는 것.
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
  /** 로컬 mp4 를 들고 있는 영상인가(제품 구동 영상 일곱 + 홈 전용 한 편) */
  const isLocal = !!video.src;
  /**
   * /videos 파사드가 쓰는 그림.
   *
   * 유튜브 영상이면 **유튜브 썸네일**이 맞다 — 누르면 유튜브가 뜨니,
   * 유튜브가 보여 줄 그림이어야 한다.
   *
   * ⚠️ 로컬 영상은 유튜브 id 가 없어 그 경로에 파일이 없다. 그쪽은 제
   *    poster(그 클립의 첫 프레임)를 쓴다 — 누르면 **같은 파일**이 도니
   *    그림이 바뀌지 않는다. ?? 갈래는 poster 를 빠뜨렸을 때의 보험이다.
   */
  const poster = isLocal
    ? video.poster ?? `/images/videos/${video.id}.webp`
    : `/images/videos/${video.id}.webp`;
  /**
   * 홈 미리보기가 쓰는 그림. **그 클립의 첫 프레임**(videos.ts 의 poster).
   *
   * ⚠️ 유튜브 썸네일로 떨어지면 안 되는 자리다. 같은 촬영본이라도 **다른
   *    순간**이라, 영상이 첫 프레임을 그리는 순간 그림이 바뀐다. 디졸브가
   *    있던 동안은 그 바뀜이 페이드에 묻혔는데, 디졸브를 걷어 낸 뒤
   *    (2b0c906) 는 그대로 번쩍임이 된다. 네 편 모두 poster 를 채워 두었다 —
   *    ?? 갈래는 빠뜨렸을 때의 보험이지 쓰라고 둔 길이 아니다.
   */
  const previewPoster = video.poster ?? poster;

  // 한 번 들어오면 관찰을 끊는다 — 오르내릴 때마다 영상을 다시 받을 이유가
  // 없다.
  useEffect(() => {
    if (!isPreview) return;
    const el = ref.current;
    if (!el) return;

    // ⚠️ '움직임 줄이기' 를 켠 사람에게는 아예 받지 않는다. globals.css 는
    //    .hero-video 를 display:none 으로 **숨기기만** 해서, 그대로 두면
    //    보이지도 않는 1MB 를 내려받는다. 정지컷은 아래 Image 가 맡는다.
    if (
      typeof matchMedia !== "undefined" &&
      matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    // IntersectionObserver 가 없으면 영상을 걸지 않는다. 아래 썸네일이
    // 그대로 남으므로 빈 칸이 되지는 않는다.
    if (typeof IntersectionObserver === "undefined") return;

    // ⚠️ rootMargin 아래쪽이 **양수**다. 화면에 닿기 400px 전에 받기 시작한다
    //    — 보통 스크롤 속도로 0.3~0.5초 먼저이고, 7초짜리 1MB 를 받기
    //    시작하기에 충분하다.
    //
    //    한때 "0px 0px -10% 0px" + threshold 0.2 였다. 음수 rootMargin 은
    //    관찰 영역을 **줄이므로**, 요소가 이미 화면에 들어오고도 20% 가
    //    보이고 아래 10% 안쪽까지 와야 발화했다. 거기서 비로소 받기 시작하니
    //    첫 스크롤에서 0.1~0.2초 멈췄다 재생되는 것처럼 보였다.
    //    Reveal 쪽 값(-12% / 0.05)을 따라 쓴 것이 잘못이었다 — 그쪽은
    //    "보일 때 나타나면" 되고, 여기는 "보이기 전에 받아야" 한다.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setInView(true);
        io.disconnect();
      },
      { rootMargin: "0px 0px 400px 0px", threshold: 0 }
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
          src={previewPoster}
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
          // poster 가 위 Image 와 같은 파일이고, 그 파일이 **이 클립의 첫
          // 프레임**이라 그림 → 영상으로 바뀌는 순간이 보이지 않는다.
          // (한때 유튜브 썸네일을 썼다. 위 Image 와 같은 파일이기는 했지만
          //  클립의 첫 프레임이 아니라, 영상이 첫 프레임을 그릴 때 한 번
          //  번쩍였다 — previewPoster 주석 참고.)
          <video
            className="hero-video absolute inset-0 h-full w-full object-cover"
            poster={previewPoster}
            autoPlay
            muted
            loop
            playsInline
            /* inView 가 된 시점에는 어차피 받을 파일이다. none 은 "요소는
                 있지만 아직 받지 마라" 라서 한 박자를 더 늦춘다. 첫 화면
               전송량과는 무관하다 — 이 요소의 마운트 자체가 inView 뒤다. */
            preload="auto"
          >
            <source src={video.preview} type="video/mp4" />
          </video>
        )}
      </div>
    );
  }

  /* ── /videos: 파사드 ────────────────────────────────────────────── */
  return (
    <div className="relative aspect-video overflow-hidden bg-black">
      {playing && isLocal ? (
        /* ⚠️ controls 가 **있다.** 홈 미리보기는 누를 것이 없는 장식 영상이라
              컨트롤이 없지만, 여기는 사용자가 "보겠다" 고 누른 본 영상이다.
              유튜브 갈래가 플레이어를 통째로 주는 것과 같은 자리다.
           ⚠️ muted 를 걸지 않는다 — 누른 뒤라 자동재생 정책에 걸리지 않고,
              소리를 죽이면 유튜브 갈래와 결이 갈린다. 혹시 브라우저가
              autoPlay 를 막아도 controls 가 있어 막다른 길이 되지 않는다.
           ⚠️ 클립이 7초 안팎이라 loop 를 건다. 한 번 돌고 멈추면 검은 칸이
              남는다. */
        <video
          src={video.src}
          poster={poster}
          controls
          autoPlay
          loop
          playsInline
          className="absolute inset-0 h-full w-full bg-black object-contain"
        />
      ) : playing ? (
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
            /* ⚠️⚠️⚠️ **2026-10-20(2) — 이 sizes 는 아무 일도 하지 않는다.**
                  바로 아래 겹이 *"그대로 두면 next/image 가 848px 칸에 절반
                  폭짜리 srcset 을 골라 흐려진다"* 고 적고 있는데, **그것은
                  추론이었고 틀렸다.** next.config 가 `images: { unoptimized:
                  true }` 라 next/image 는 srcset 을 **아예 만들지 않는다** —
                  빌드 결과를 뒤져 확인했다(`out/videos/index.html` 에
                  `srcset=` 이 **0개**). 원본 한 장이 그대로 간다.
               ⚠️ 그래도 **값은 칸 크기에 맞춰 둔다.** unoptimized 를 끄는 날
                  이 줄이 되살아나고, 그때 어긋난 값이 남아 있으면 흐려진다.
                  2026-10-20(2) 격자 실측: 1280~ 528px · 1024 464px.
               ⚠️ 화질을 걱정할 자리는 sizes 가 아니라 **포스터 원본 크기**다
                  (유튜브가 주는 최대가 1280×720 — fetch-video-thumbs.mjs).

               아래는 틀린 설명이다. 지우지 않는다 — 같은 추론을 또 하지 않기 위해 둔다 —
               ⚠️ 2026-10-19(4) — 격자가 **1열**이 되면서 고쳤다. 전에는
                  "(min-width: 640px) 50vw, 100vw" 였는데, 그대로 두면
                  next/image 가 848px 칸에 **절반 폭짜리 srcset** 을 골라
                  흐려진다. Container 가 1088px 에서 멈추므로 칸의 최대가
                  848px 다(VideoBrowser 의 격자 주석에 폭별 표가 있다).
               ⚠️ 이 값은 **파사드 쪽만**이다. 홈 미리보기(위 preview 갈래)는
                  여전히 lg 에서 2열이라 50vw 가 맞다. */
            sizes="(min-width: 1280px) 528px, (min-width: 1024px) 464px, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-dark/25 transition-colors group-hover:bg-dark/10"
          />
          {/* 맨 위로 버튼(BackToTop)과 같은 언어다 — rounded-full + bg-white
              + text-ink + shadow-card. 전에는 64px 브랜드 레드 원이었는데,
              레드 원은 유튜브 자체의 재생 버튼과 겹쳐 보이고 이 사이트에서
              레드는 강조 한 점에만 쓰는 색이다.

              흰 원이 밝은 썸네일 위에서도 보이는 것은 바로 위의 어두운
              겹(dark/25) 덕이다. 그 겹을 지우면 원이 묻힌다.

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

      {/* ⚠️⚠️ **2026-10-19(4) — 길이 배지.** 유신이 1열로 바꾸며
             *"이제 공간에 여유가 있다보니 영상 길이도 넣어도 될거 같은데"*
             라고 했다. 값과 출처는 videoLibrary 의 SECONDS 주석에 있다.

          ⚠️ **로컬에는 「반복」을 붙인다.** 로컬 여덟은 전부 7초라 그냥
             길이만 적으면 「0:07」이 여덟 번 찍힌다 — 그래서 지난 판에
             한 번 접었던 것이다. 「0:07 반복」이면 그 되풀이가 **설명**이
             된다(짧은 구동 클립이지 본 영상이 아니다).
          ⚠️ 자리는 **포스터 오른쪽 아래**다. 유튜브가 쓰는 자리라 설명이
             필요 없고, 글 칸에 넣으면 빨강 굵은 기종 라벨과 성격이 섞인다.
          ⚠️ **누르면 사라진다**(playing 이면 안 낸다). 재생 중에는 플레이어
             자신의 시간 표시가 있고, 로컬 갈래는 controls 막대가 바로 이
             자리에 뜬다.
          ⚠️ `pointer-events-none` — 바로 아래 재생 버튼이 inset-0 이라
             배지가 그 모서리를 덮는다. 없으면 오른쪽 아래가 안 눌린다.
          ⚠️ 빨강을 쓰지 않는다. 11px 은 README 의 다섯 단계 안이다.

       ⚠️⚠️⚠️ **2026-10-20(2) — 다시 접었다. 이 자리의 세 번째 판이다.**
          유신이 *"여기 0:26 / 1:29 이런 동영상 길이 이거는 지워도 될 거
          같고"* 라고 했다. **접었다(0:07 이 여덟 번) → 폈다(공간이 생겨서)
          → 다시 접는다.** 위 두 겹이 그 앞 두 판의 기록이고 지우지 않는다.
          ⚠️ **뜨던 곳은 `/videos` 뿐이었다.** 걷기 전에 빌드 결과를 세어
             확인했다 — `out/videos/index.html` 에 12개, 홈·제품 상세는
             **0개**다. 홈은 preview 갈래라 이 분기를 타지 않고 제품 상세는
             ProductVideo 가 따로 그린다. 그래서 유신이 본 것과 사라지는
             것이 정확히 같다.
          ⚠️ `videoLibrary.ts` 의 `seconds` 필드와 SECONDS 주석은 **그대로
             둔다** — 값과 출처가 거기 있고, 되살리는 비용이 아래 블록
             하나가 되게 둔다.
          ⚠️ `isLocal` 은 아래 유튜브 갈래가 계속 쓴다. 안 쓰는 변수가
             되지 않는다.

          되살리려면 아래를 꺼내 이 주석 뒤에 둔다 —

      {!playing && video.seconds !== undefined && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-3 right-3 rounded-md bg-dark/80 px-2 py-1 text-11 font-semibold leading-none text-white"
        >
          {`${Math.floor(video.seconds / 60)}:${String(video.seconds % 60).padStart(2, "0")}`}
          {isLocal && " 반복"}
        </span>
      )}  */}

      {/* 스크립트가 꺼져 있으면 유튜브로 보낸다. 로컬 영상은 갈 유튜브
          쪽이 없으므로 내지 않는다 — 제품 상세에 같은 영상이 있다. */}
      {!isLocal && (
      <noscript>
        <a
          href={watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 flex items-end bg-dark/40 p-4 text-sm font-semibold text-white"
        >
          {video.title} — 유튜브에서 보기
        </a>
      </noscript>
      )}
    </div>
  );
}
