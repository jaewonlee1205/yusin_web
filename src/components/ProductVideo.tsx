"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/**
 * 소리 없이 저절로 도는 장식 영상 한 편. **두 자리가 쓴다** —
 *   제품 상세의 "구동 영상"(product-*.mp4 일곱 편)
 *   홈 PERFORMANCE 섹션(hero.mp4)
 *
 * ⚠️ 홈 쪽은 한때 이 컴포넌트를 쓰지 않고 같은 마크업을 복사해 두고 있었다.
 *    그래서 autoPlay 가 즉시 걸려 **hero.mp4(1.59MB)가 홈에서 두 번**
 *    내려왔다(히어로 + 여기 = 3.2MB). 아래 지연 로딩이 그걸 없앤다.
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
  frame,
  wrap = "",
  pos,
}: {
  video: { src: string; poster: string; note: string };
  /** 영상 틀의 비율·높이. 기본은 전폭용이다(제품 상세 「구동 영상」).
   *
   * ⚠️⚠️ **lg:aspect-[3/1] 은 「전폭을 쓸 때」의 값이다.** 2026-10-15 에
   *    홈 PERFORMANCE 가 이 컴포넌트를 **반폭**으로 쓰기 시작하면서
   *    갈라졌다 — 반폭에 3:1 을 그대로 두면 너무 납작해진다.
   *    거기서는 "aspect-video lg:aspect-auto lg:h-full" 을 넘겨, 옆에
   *    선 부품 카드와 **같은 높이**가 되게 한다(영상은 object-cover 라
   *    늘어나도 찌그러지지 않고 잘릴 뿐이다).
   *    ⚠️ 바꾸면 **자막 띠의 대비를 다시 잰다** — 아래 주석에 15.0:1 로
   *       적힌 그 값이다. 틀이 바뀌면 영상에서 보이는 자리가 달라진다. */
  frame?: string;
  /** 바깥 틀에 얹을 클래스. 높이를 물려받게 할 때 쓴다(lg:h-full).
   *
   * ⚠️⚠️ **한때 이 자리가 Reveal 이었다.** 지금은 평범한 div 다 — 아래
   *    return 의 주석 참고. 클래스는 **그대로 여기 얹어야 한다.** */
  wrap?: string;
  /** 잘리는 자리. object-cover 는 **가운데로** 자르는데, 틀이 납작할수록
   *  위아래가 많이 깎인다.
   *
   *  ⚠️ 유신 영상은 **보여줄 것이 아래에 있다** — 트랙과 부품이 화면 중앙에서
   *     아래쪽에 걸린다. 가운데로 자르면 정작 그게 깎인다. 홈 PARTS 섹션은
   *     칸이 2.34:1(32% 잘림)이라 "object-[center_62%]" 로 **위를 더 자른다.**
   *     50 · 62 · 72% 를 두 영상에 나란히 걸어 보고 골랐다 — 50 은 자막이
   *     부싱 줄을 덮었고, 72 는 위쪽 가이드가 잘렸다.
   *  ⚠️ 제품 상세는 3:1 전폭이라 사정이 다르다 — 기본값(가운데)을 쓴다. */
  pos?: string;
}) {
  const [load, setLoad] = useState(false);
  /**
   * 영상이 **실제로 재생을 시작했는지**. 그때까지는 숨긴다.
   *
   * ⚠️⚠️ 유신이 짚었다 — *"페이지 이동 많이 한다음 … 밑으로 스크롤 해서
   *    내리면 … 영상이 **뭔가 흐릿하게 이상한게 뜨고** 영상이 실행돼"*.
   *    페이지를 오가며 영상이 **캐시에 남으면**, 재생 준비가 끝나기 전에
   *    `<video>` 가 먼저 자리를 차지하고 **첫 프레임이 덜 디코딩된 채**
   *    흐릿하게 그려진다. 처음 들어왔을 때는 받는 데 시간이 걸려 그 구간이
   *    안 보이지만, 캐시에서 오면 그 순간이 눈에 띈다.
   * ⚠️ `onPlaying` 뒤에 보여 주면 그 사이에는 **뒤에 깔린 포스터**가 그대로
   *    보인다 — 새로 받을 것이 없는 그림이다.
   * ⚠️ `poster` 속성은 **그대로 둔다.** JS 가 막힌 환경의 마지막 보루다.
   *
   * ⚠️⚠️⚠️ **포스터는 반드시 그 영상의 「첫 프레임」이어야 한다.**
   *    아래 `transition-opacity duration-300` 이 포스터 위로 영상을 겹쳐
   *    띄우는데, 둘이 같은 그림이면 **아무것도 안 보이고** 다른 그림이면
   *    **300ms 짜리 디졸브**가 된다.
   *
   *    2026-10-19 에 유신이 짚었다 — *"처음 시작하고 … **흐리게 처리**
   *    된다음 … 처음에 스크롤 내리면 엄청 이상하게 보여"*. 재어 보니
   *    **다섯 편의 포스터가 전혀 다른 프레임**이었다(SSIM 1.0 = 같은 그림) —
   *
   *      part-seal                0.119 → 0.996
   *      product-urethane-coating 0.157 → 0.992
   *      performance              0.207 → 0.992
   *      part-pin                 0.311 → 0.995
   *      part-bracket             0.377 → 0.995
   *
   *    까닭은 **영상만 갈고 포스터를 안 구운 것**이다. 다섯 편 모두
   *    2026-10-16 에 다시 자른 파일이고, 같은 날 바뀐 hero.mp4 는 포스터도
   *    함께 만들어 0.986 이라 멀쩡했다.
   *
   *    ⚠️ **영상을 갈아 끼우면 포스터도 같은 날 다시 굽는다.** 한 줄이다 —
   *      ffmpeg -i <영상> -vf "select=eq(n,0)" -frames:v 1    *             -c:v libwebp -compression_level 6 -quality 85 <포스터>
   *    ⚠️ 재는 법 (0.97 아래면 다시 굽는다) —
   *      ffmpeg -i <영상> -i <포스터> -filter_complex    *        "[0:v]select=eq(n,0),scale=320:180,format=gray,setpts=N[a];
   *         [1:v]scale=320:180,format=gray,setpts=N[b];[a][b]ssim=-"    *        -frames:v 1 -f null -
   *    ⚠️ quality 85 는 **옛 포스터 크기(26~51KB)에 맞춘 값**이다. 키우면
   *       LCP 에 걸린다 — 지금 다섯은 34~47KB 다.
   *
   * ── 아직 남은 것 — **루프 이음새** (2026-10-19 에 재 두었다)
   *
   *    끝 프레임 ↔ 첫 프레임 SSIM 이다. 낮을수록 7초마다 **장면이 툭 바뀐다.**
   *    유신이 이번엔 *"포스터만"* 으로 정했으므로 손대지 않았다 —
   *    고치려면 원본 촬영본에서 **앞뒤가 이어지는 구간**으로 다시 잘라야 한다.
   *
   *      part-pin                 0.960  ✓     product-bowl-feeder      0.548  △
   *      part-bracket             0.952  ✓     product-soundproof-cover 0.242  ✗
   *      part-seal                0.935  ✓     preview-bowl-jig         0.211  ✗
   *      hero                     0.890  ✓     product-controller       0.182  ✗
   *      product-urethane-coating 0.863  ✓     product-linear-feeder    0.119  ✗
   *      performance              0.806  ✓     product-vibrator         0.118  ✗
   *                                            preview-metal-parts      0.088  ✗
   *
   *    ⚠️ 포스터를 고친 다섯 편은 **전부 왼쪽(이음새가 좋은 쪽)**이다 —
   *       홈 PARTS 는 이번 판으로 깨끗해졌다. 끊기는 일곱은 제품 상세와
   *       홈 미리보기 쪽이다.
   */
  const [playing, setPlaying] = useState(false);
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

  /* ⚠️⚠️ **영상에는 스크롤 리빌을 걸지 않는다.** 2026-10-19 에 유신이
       *"동영상 생기는 것 보다 그냥 애니메이션 적용 안하는 편이 더 좋을거
       같네"* 라고 해서, 사이트에서 **영상이 보이는 곳 전부**에서 걷었다
       (홈 부품 형상별 설비 · 홈 제품 영상 · 제품 상세 구동 영상 · 영상자료).

     ⚠️ 한때 `delay` prop 이 있었다. 2026-10-16 에 홈 PARTS 에서 **카드는
        i*80 으로 늦추는데 영상은 늘 0** 이라 둘째 행부터 영상이 먼저 뜨는
        일이 났고(*"영상이 먼저 생기고 그다음 3D 렌더링이 생겨"*), 부르는
        쪽에서 카드와 같은 값을 넘겨 맞췄다. 이제 **양쪽 다 리빌이 없어**
        그 짝 맞추기 자체가 없어졌다.

     ⚠️⚠️ **`wrap` 은 평범한 div 로 그대로 넘어가야 한다.** lg:h-full 사슬이
        격자 칸 → 이 틀 → 영상 틀로 이어지는데, 한 겹이라도 끊기면 영상이
        옆 카드와 높이가 어긋난다. */
  return (
    <div className={wrap}>
      <div
        ref={ref}
        className={`relative overflow-hidden rounded-2xl bg-surface ${frame ?? "aspect-video lg:aspect-[3/1]"}`}
      >
        <Image
          src={video.poster}
          alt=""
          fill
          sizes="100vw"
          className={`object-cover ${pos ?? ""}`}
        />
        {load && (
          <video
            className={`hero-video absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
              playing ? "opacity-100" : "opacity-0"
            } ${pos ?? ""}`}
            poster={video.poster}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            /* ⚠️⚠️ **둘 다 받는다.** `onPlaying` 만 걸면 재생이 시작되지 않는
               환경에서 영상이 **영영 숨겨진다** — 실제로 헤드리스 Chromium 은
               H.264 코덱이 없어 readyState 가 0 에서 멈춘다(검사하다 걸렸다).
               `onLoadedData` 는 **첫 프레임이 디코딩된** 시점이라, 흐릿하게
               그려지는 구간은 이미 지나 있고 재생 여부와는 무관하다. */
            onLoadedData={() => setPlaying(true)}
            onPlaying={() => setPlaying(true)}
          >
            <source src={video.src} type="video/mp4" />
          </video>
        )}

        {/* 설명은 영상 위 하단에 겹친다. 한때 영상 아래 회색 한 줄이었는데,
            큰 영상 다음에 작은 글씨가 왼쪽에 홀로 떠 글과 그림이 따로 놀았다.

            ⚠️ <video> 가 아니라 **칸**의 자식이다. 그래야 '움직임 줄이기' 에서
               영상이 display:none 이 되어도 뒤에 깔린 정지컷 위에 설명이
               그대로 남는다.

            ⚠️ 흰 글씨가 읽히는 것은 그라데이션 덕이다. 2026-10-14 에 막 색을
               여러 번 바꿔 가며 그때마다 아홉 편을 다시 쟀고, **아래가 지금
               값**이다 — 포스터의 하단 22% 띠 평균 Y 와, 그 위에 /85 를 덮은
               뒤의 흰 글자 대비.

                 bowl-feeder      Y  64.7   16.2:1
                 controller       Y  87.0   15.6:1
                 linear-feeder    Y  96.2   15.3:1
                 soundproof       Y 100.4   15.2:1
                 urethane         Y 101.9   15.1:1
                 hopper-feeder    Y 117.4   14.7:1
                 vibrator         Y 124.5   14.5:1   <- 가장 밝음

               가장 밝은 진동기도 14.5:1 로 AAA(7:1)의 두 배다. 거쳐 온 색
               가운데 **지금이 가장 높다**(네이비 9.2 · 차콜 14.2 · 와인 13.3).
               영상을 갈아 끼울 때 하단이 더 밝으면 다시 잰다.

            pointer-events-none — 누를 것이 없는 장식 영상이라 마우스를
            가로채지 않는다. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-dark/85 via-dark/40 to-transparent px-5 pb-5 pt-12 sm:px-6 sm:pb-6">
          <p className="text-13 font-medium leading-relaxed text-white sm:text-sm">
            {video.note}
          </p>
        </div>
      </div>
    </div>
  );
}
