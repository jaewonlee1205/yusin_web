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
      {/* 배경 — **문의 띠(ContactCTA)의 거울상**이다.

          "문의 띠하고 배경장식 동일하게 하자. 근데 문의 띠는 동그라미가 왼쪽에
          있다면 배너는 오른쪽에 있고, 옆에 ··· 많은 거 이거를 왼쪽에 두게.
          180도 회전한 것 같은 느낌이지, 역방향이니까 위치가 양옆이 바뀌어서"
          라는 말을 듣고 맞춘 자리다.

            문의 띠   사선 면 왼쪽  · 원 왼쪽 아래  · 점 격자 오른쪽 위
            배너     사선 면 오른쪽 · 원 오른쪽 아래 · 점 격자 **왼쪽 위**

          좌우가 반대인 데에는 까닭이 있다. 문의 띠는 **버튼이 오른쪽**이라
          레드가 밝은 면에 닿지 않게 왼쪽으로 몰았고, 배너는 **글이 왼쪽**이라
          오른쪽이 통째로 빈다.

          ⚠️⚠️ **값이 문의 띠에서 그대로 온 것이다.** 사선 폭·각도, 원 크기,
             점 간격·진하기가 모두 같다. **한쪽을 고치면 다른 쪽도 볼 것.**

          ⚠️ 여기까지 네 번 바뀌었다 — 동심원 파문 → 가로 선 격자 → 가로 선 +
             사선 + 원 → 지금(문의 띠 거울상). 가로 선(---)은 "이거 하고 맞출
             거니까 없애도 될 것 같네" 라는 말에 걷었다.
             ⚠️ **동심원을 되살리지 말 것** — "별로 안 예쁘고 잘 보이지도 않네
                너무 연해서" 라는 말을 들었고, 진하기를 올려도 마찬가지였다.

          ⚠️ 38도는 로고 획에서 받은 값이다(Header.tsx 주석 참고). 바꾸지 말 것.

          ⚠️ **모든 폭에서 보인다.** 문의 띠의 사선·원은 lg 전용인데, 거기는 좁은
             폭에서 버튼이 전체 폭을 써서 레드가 밝은 면을 밟기 때문이다. 배너에는
             버튼이 없고 흰 글자(17:1)뿐이라 그 제약이 없다.

          ⚠️ eyebrow 만 13px brand-light 다. 사선 위에서 6.08 → 5.62 로 내려가고
             점 격자가 그 뒤를 지나지만 AA(4.5)는 넘는다. **사선을 왼쪽으로 옮기지
             말 것** — 닿으면 4.64 까지 떨어진다. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute right-[11.4%] top-1/2 h-[300%] w-[22%] -translate-y-1/2 rotate-[38deg] bg-white/[0.04]" />
        <div className="absolute -right-[7.2%] top-1/2 h-[300%] w-[11%] -translate-y-1/2 rotate-[38deg] bg-white/[0.10]" />
        <div className="absolute -bottom-[40%] -right-[8%] aspect-square h-[160%] rounded-full bg-white/[0.03]" />
        {/* 점 격자. 문의 띠의 cta-dots 와 같은 값이고 right-0 이 left-0 으로만
            바뀌었다. ⚠️ pattern id 는 달라야 한다 — 9개 페이지가 이 배너와 문의
            띠를 **한 화면에 함께** 쓴다. 같은 id 를 두면 뒤에 오는 쪽이 앞의
            정의를 가져다 쓴다. */}
        <svg className="absolute left-0 top-0 h-[110px] w-[220px] text-white opacity-[0.16] sm:h-[88px] sm:w-[264px]">
          <defs>
            <pattern
              id="hero-dots"
              width="22"
              height="22"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="1.6" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-dots)" />
        </svg>
      </div>
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
