"use client";

import { useMemo, useRef, useState } from "react";
import VideoCard from "./VideoCard";
import { videoKinds, videoLibrary } from "@/data/videoLibrary";

/**
 * /videos 의 영상 목록 — 옆 기종 거르개 + 격자.
 *
 * ⚠️⚠️ **2026-10-19 — 갤러리(/clients) 꼴로 다시 지었다.** 유신이 짚었다 —
 *    *"전체적인 디자인이 갤러리 같은 경우 잘 되어 있다보니 갤러리 쪽 UI
 *    형태로 영상쪽도 만드는게 좋아 보이네"*, 거르개는 *"이렇게 옆에 할 수
 *    있게 하고"*, 칸은 *"그래도 동영상 이다 보니깐 저 이미지 보다는 크기를
 *    키우고"*. 전에는 거르개 없이 2열 격자뿐이었다.
 *
 * ⚠️⚠️⚠️ **거르개 패널이 이 저장소에 이제 셋이다** —
 *    `ProductBrowser`(제품 분류) · `PhotoLightbox`(기종) · 여기(기종).
 *    aside 의 클래스 문자열은 셋이 **글자까지 같다.** 앞 둘의 주석도
 *    *"ProductBrowser 에서 그대로 가져왔다"* 고 적고 있다.
 *    공통 부품으로 빼내는 것은 /products · /clients · /videos **세 쪽을 함께
 *    흔드는 일**이라 이번 판에서 하지 않았다. 빼내려면 세 쪽의 스크롤 보정을
 *    다시 재고(각 쪽의 항목 수가 7 ↔ 155 ↔ 12 로 다르다) 함께 찍어 본다.
 *    한쪽만 고치면 **같은 부품이 쪽마다 달라 보인다.**
 *
 * ⚠️ **리빌이 없다**(2026-10-19). 유신이 *"동영상 생기는 것 보다 그냥
 *    애니메이션 적용 안하는 편이 더 좋을거 같네"* 라고 해서 영상이 보이는
 *    곳 전부에서 걷었다. `videos/page.tsx` · `ProductVideo` · 홈 VIDEO 섹션에
 *    같은 경고가 있다. 격자에 `Reveal` 을 다시 붙이지 말 것.
 *
 * ⚠️ 거르기는 클라이언트 상태다. 기종별 URL(북마크·뒤로가기)로 만들려면
 *    정적 내보내기(output: "export") 특성상 라우트를 기종 수만큼 늘려야
 *    한다 — ProductBrowser 와 같은 판단이다.
 */

/** 사이드바가 붙는 높이(lg:top-24)와 같은 값. 헤더(81px)를 15px 띄운다. */
const STICK_TOP = 96;

export default function VideoBrowser() {
  /** null 이 「전체」 */
  const [filter, setFilter] = useState<string | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  /**
   * 기종을 고르면 **격자 머리가 화면 밖일 때만** 끌어 올린다.
   *
   * ⚠️⚠️ **`PhotoLightbox` 판을 가져왔다**(ProductBrowser 판이 아니다).
   *    그쪽이 뒤에 나온 것이고, 거기서 두 번 고친 내력이 그대로 여기에도
   *    해당한다 —
   *      ① `scrollTo` 를 `setFilter` **뒤에** 한다. 먼저 옮기면 문서가
   *         줄어들 때 브라우저가 잘라 버려 바닥 근처에서 더 많이 올라간다.
   *      ② 문서 기준 **절대 좌표**로 옮긴다. 중간에 잘려도 결과가 같다.
   *      ③ 진짜 범인은 **스크롤 앵커링**이었다 — 아래 격자의
   *         `[overflow-anchor:none]` 이 고침이다.
   *
   * ⚠️ 그래도 **다시 쟀다.** PhotoLightbox 주석이 *"ProductBrowser 에서
   *    괜찮았다는 것이 여기서도 괜찮다는 뜻은 아니다"* 라고 못박고 있고,
   *    여기는 12 ↔ 1 이라 또 다른 규모다(그쪽은 155 ↔ 2).
   *    영상 칸은 16:9 로 높이가 미리 정해져 있어 조건은 같다.
   */
  const pick = (next: string | null) => {
    const el = resultRef.current;
    const absTop = el ? el.getBoundingClientRect().top + window.scrollY : null;
    setFilter(next);
    if (absTop === null) return;
    requestAnimationFrame(() => {
      if (window.scrollY > absTop - STICK_TOP) {
        window.scrollTo(0, Math.max(0, absTop - STICK_TOP));
      }
    });
  };

  /* ⚠️ 거르는 법은 **포함**이다(PhotoLightbox 와 같다). 지금은 영상마다
     기종이 하나뿐이지만, 한 영상에 둘이 보이는 촬영본이 생기면 두 기종
     모두에서 나와야 한다. */
  const shown = useMemo(
    () =>
      filter
        ? videoLibrary.filter((v) => v.kinds.includes(filter))
        : videoLibrary,
    [filter],
  );

  return (
    /* lg:items-start 가 없으면 안 된다. 플렉스 기본값(stretch)이면 aside 가
       행 높이를 꽉 채워 sticky 가 아무 일도 하지 않는다. */
    <div className="lg:flex lg:items-start lg:gap-8">
      <aside className="hidden lg:sticky lg:top-24 lg:block lg:w-52 lg:shrink-0">
        {/* 머리말은 「기종」 — 배너가 이미 VIDEO 라 영문을 또 쓰지 않는다.
            제작실적 쪽 거르개와 **같은 글자**여야 한다(videoKinds 주석). */}
        <nav
          aria-label="기종"
          className="overflow-hidden rounded-2xl bg-white shadow-card"
        >
          <p className="bg-dark-soft px-5 py-3.5 text-center text-xs font-bold tracking-[0.08em] text-white">
            기종
          </p>
          <ul className="border-t border-line">
            {[null, ...videoKinds].map((k) => {
              const active = filter === k;
              return (
                <li key={k ?? "전체"}>
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() => pick(k)}
                    className={`flex w-full items-center justify-center px-5 py-3 text-center text-sm transition-colors ${
                      active
                        ? "bg-surface font-bold text-brand"
                        : "font-medium text-ink-soft hover:bg-surface hover:text-ink"
                    }`}
                  >
                    {k ?? "전체"}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* ⚠️⚠️ **[overflow-anchor:none] — 브라우저의 스크롤 보정을 끈다.**
          기종을 바꾸면 사라지는 칸을 앵커로 잡고 있던 브라우저가, 내
          `scrollTo` 가 끝난 **다음 프레임에** 스크롤을 혼자 끌어내린다
          (PhotoLightbox 의 pick 주석에 프레임 로그가 있다).
          ⚠️ 끄는 것이 위험한 경우는 **스크롤 중에 위쪽 내용이 끼어들 때**다.
             영상 칸은 aspect-video 로 높이가 **미리 정해져** 있어 포스터가
             늦게 와도 아래가 밀리지 않는다 — 끌 수 있는 조건이다.
          ⚠️ 바깥 칸과 <ul> **둘 다**에 건다. 한 쪽만 끄면 다른 쪽이 앵커
             후보로 남는다. */}
      <div ref={resultRef} className="min-w-0 flex-1 [overflow-anchor:none]">
        {/* 좁은 화면용 칩 줄. 세로 목록을 얹으면 영상이 보이기까지 한참
            내려야 한다(ProductBrowser · PhotoLightbox 도 같다).
            ⚠️ **숫자는 넣지 않는다** — 일곱 기종 중 여섯이 한 편짜리라
               숫자가 거의 다 1 이 된다(videoKinds 주석). */}
        <div className="mb-5 flex flex-wrap gap-2 lg:hidden">
          {[null, ...videoKinds].map((k) => {
            const active = filter === k;
            return (
              <button
                key={k ?? "전체"}
                type="button"
                aria-pressed={active}
                onClick={() => pick(k)}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "border-brand bg-brand text-white"
                    : "border-line bg-white text-ink-soft hover:border-dark-soft/40 hover:text-ink"
                }`}
              >
                {k ?? "전체"}
              </button>
            );
          })}
        </div>

        {/* ⚠️ **갤러리보다 칸이 크다.** 유신이 *"동영상 이다 보니깐 저 이미지
               보다는 크기를 키우고"* 라고 했다. 열 수를 한 단계씩 줄여서
               얻는다 —

                 폭          갤러리   영상
                 ~639         2열     **1열**
                 640~1023     3열      2열
                 1024~1279    3열     **2열**   (+aside 208 + gap 32)
                 1280~        4열     **3열**   (+aside)

            ⚠️ xl 부터 3열인 것은 `ProductBrowser` 와 같은 까닭이다 —
               aside 208px 과 간격 32px 를 뺀 자리에 4열을 끼우면 칸이
               갤러리 칸보다 **작아진다.**
            ⚠️ 열둘은 2열.3열 **둘 다 나누어떨어지는** 수다. 마지막 줄에
               외톨이가 남지 않는다 — videoLibrary.ts 주석 참고. */}
        <ul className="grid gap-6 [overflow-anchor:none] sm:grid-cols-2 sm:gap-8 xl:grid-cols-3">
          {shown.map((video) => (
            <li key={video.id}>
              <VideoCard video={video} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
