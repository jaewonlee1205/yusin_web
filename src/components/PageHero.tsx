import Container from "./Container";

/**
 * 하위 페이지 공통 상단 배너. 제품 상세를 뺀 9개 페이지가 쓴다
 * (제품 상세는 Breadcrumb 이 그 자리를 맡는다).
 *
 * 리드 문구 길이가 페이지마다 달라 배너 높이가 들쭉날쭉하면, 메뉴를 옮겨 다닐 때
 * 화면이 들썩인다. 그래서 배너 높이를 고정하고 내용을 세로 가운데로 맞춘다.
 *
 * 리드에 비워 두는 자리가 폭마다 다르다. 좁은 화면(sm 미만)은 두 줄,
 * sm 부터는 한 줄이다. 전에는 sm 에서도 두 줄을 비워 뒀는데, 15개 배너의
 * 리드가 640px 이상에서 모두 한 줄이라 27px 이 늘 비어 있었다. 바닥값
 * (sm:min-h)도 304 -> 240px 로 내렸다 — 내용 높이 238px 에 2px 만 남긴
 * 값이라, 모든 배너가 240px 로 같아진다.
 *
 * ⚠️ lead 를 새로 쓰거나 고칠 때 — 640px 에서 한 줄에 들어가는지 확인할 것.
 *    글상자가 560.8px 이고 18px 한글 기준 약 41자다. 넘기면 그 배너만
 *    29px 길어져 다른 페이지와 어긋난다. 좁은 화면에서는 두 줄까지 괜찮다.
 */
export default function PageHero({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
}) {
  return (
    /* 네이비 한 장이다.

       ⚠️⚠️ **2026-10-14 에 surface(#f6f7f9) 에서 dark(#0d1b33) 로 뒤집었다.**
          "이쪽 색상 경우 밝은 회색처럼 보이는데 ... 문의 띠 여기 색상하고
          동일하게 해주고 네이비 글자는 흰색으로" 라는 말을 들었다. 기준은
          헤더의 dark-deep(#0a1426)이 아니라 **문의 띠의 dark** 다 — "견적 문의
          여기보다는 덜 찐한 네이비야" 라고 짚어 주었다.

          그 전 기록은 이랬다 — "전에는 네이비 위에 장식이 세 겹이었다(기술
          그리드 · 대각 그라디언트 · 아래쪽 1px 빨간 선). 셋을 걷고 바탕을
          surface 로 올리니 헤더(흰색)와 본문(흰색) 사이에서 배너가 한 덩어리로
          읽힌다. 색 면은 페이지 끝의 CTA 한 곳에만 남는다." 그 뒤 **헤더와
          푸터가 네이비가 되면서** 그 전제가 사라졌다. 지금은 헤더 · 배너 ·
          문의 띠 · 푸터가 네이비이고 본문만 흰색이다.

       ⚠️ 글자 색은 눈대중이 아니라 이 바탕 위 대비로 골랐다. 계산이 아니라
          **화면 픽셀을 뽑아 잰 값**이다 — Tailwind v4 는 computed color 를
          oklab 으로 내보내 자동 측정이 어긋난다.

            제목     white         17.01:1
            lead     white/70       8.76:1
            eyebrow  brand-light    6.08:1

          ⚠️⚠️ **eyebrow 를 brand 로 되돌리지 말 것.** #d5261e 는 이 바탕에서
             3.38:1 인데 eyebrow 는 13px 이라 AA(4.5)에 못 미친다. 헤더의 메뉴
             active 와 전화 아이콘이 같은 이유로 brand-light 다.
          (옛 값 ink 15.9 · ink-soft 8.4 · brand 5.78 은 전부 surface 기준이다.)

       ⚠️ relative 는 아래 장식 겹의 기준이다. 빼면 장식이 페이지 전체로 퍼진다. */
    <div className="relative overflow-hidden bg-dark">
      {/* 동심원 파문. 진동이 퍼지는 모양이다 — 진동기를 만드는 회사라는 정체성과
          맞고, **문의 띠가 쓰는 사선 면 · 점 격자와 어휘가 겹치지 않는다**.
          "배경 장식도 고려해야 할 거 같고 ... 문의 띠하고는 다르게 해야 할 거
          같고" 라는 말을 듣고 고른 자리다.

          ⚠️ 바깥 원일수록 흐리다(0.10 → 0.04). 파문이 퍼지며 약해지는 결이다.
             넷을 같은 진하기로 두면 과녁처럼 보인다.

          ⚠️ 원이 배너(240px)보다 커서 위아래가 잘린다. 파문의 한가운데만
             보이는 것이 의도다 — 원 네 개를 다 보여 주면 장식이 주인공이 된다.

          ⚠️ **9개 페이지에 반복되는 면이다.** 눈에 먼저 들어오면 과한 것이다. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 560 560"
        fill="none"
        stroke="currentColor"
        className="pointer-events-none absolute -right-20 top-1/2 h-[560px] w-[560px] -translate-y-1/2 text-white"
      >
        <circle cx="280" cy="280" r="70" opacity="0.1" />
        <circle cx="280" cy="280" r="140" opacity="0.08" />
        <circle cx="280" cy="280" r="210" opacity="0.06" />
        <circle cx="280" cy="280" r="279.5" opacity="0.04" />
      </svg>
      {/* 문의 띠와 같은 그레인 겹이다. 단색 면이라 히어로(0.08)보다 진하게 0.12. */}
      <div
        aria-hidden="true"
        className="grain pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-overlay"
      />
      {/* ⚠️ relative 다. 장식이 absolute 라 그냥 두면 글자 위에 얹힌다 —
             지금은 진하기가 낮아 티가 안 나지만, 장식을 진하게 만질 때
             이 한 줄이 글자를 지켜 준다. */}
      <Container className="relative flex min-h-[13.5rem] flex-col justify-center py-12 sm:min-h-[15rem] sm:py-14">
        {/* 글자가 아래에서 올라오며 나타난다.

            한동안 여기만 애니메이션을 두지 않았다. 메뉴를 옮겨 다닐 때마다
            매번 기다리게 된다는 이유였는데, 맞는 걱정이지만 답이 "빼기" 는
            아니었다. 홈 히어로가 느린 것이지(.rise 0.7초 + 지연 300ms =
            약 1초) 움직임 자체가 문제가 아니다.

            그래서 .rise-quick 을 따로 뒀다. 거리 0.6rem, 0.45초, 지연
            0/70/140ms — 전부 끝나는 데 약 0.59초라 기다린다는 느낌이 들기
            전에 끝난다. 홈 히어로는 첫 화면 연출이라 .rise 그대로다.

            배너 높이가 min-h 로 고정이고 justify-center 라, opacity 와
            transform 만 움직이는 이 연출은 아래 내용을 밀지 않는다(CLS 0).
            prefers-reduced-motion 에서는 globals.css 끝 블록이 모든
            애니메이션을 꺼 버리므로 글자가 즉시 보인다. */}
        <p
          className="rise-quick text-13 font-semibold tracking-[0.02em] text-brand-light"
          style={{ animationDelay: "0ms" }}
        >
          {eyebrow}
        </p>
        <h1
          className="rise-quick mt-3 text-3xl font-bold tracking-tight text-white sm:text-5xl"
          style={{ animationDelay: "70ms" }}
        >
          {title}
        </h1>
        {lead && (
          <p
            className="rise-quick mt-5 min-h-[3.25rem] max-w-2xl text-base leading-relaxed text-white/70 sm:min-h-[1.875rem] sm:text-lg"
            style={{ animationDelay: "140ms" }}
          >
            {lead}
          </p>
        )}
      </Container>
    </div>
  );
}
