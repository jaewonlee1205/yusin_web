import Link from "next/link";
import MagneticLink from "./MagneticLink";
import Container from "./Container";
import Reveal from "./Reveal";
import { PhoneIcon } from "./icons";
import { site, telHref } from "@/data/site";

/**
 * 페이지 하단 공통 문의 유도 블록. /contact 를 뺀 9개 페이지가 쓴다.
 *
 * lg 부터 [제목+본문] 과 [버튼] 두 칸이다. 칸을 정하는 방식을 두 번 고쳐 왔다.
 *
 *   justify-between 으로 양 끝에 붙임  →  1216px 행에 내용이 805px 뿐이라
 *                                        가운데가 411px 비었다
 *   가운데 1단으로 모음                →  구멍이 양옆으로 옮겨 갔을 뿐이고
 *                                        (좌우 약 400px 씩) 세로도 311→432px
 *   minmax(0,1fr) auto  ← 지금          →  내용이 행을 다 쓴다
 *
 * 증상은 셋 다 같은 원인이었다 — 내용을 행의 일부에만 담고 있었다. 왼쪽 칸이
 * 남는 폭을 전부 먹고 오른쪽 칸은 버튼 행의 실제 폭(421px)만 가지면, 제목과
 * 본문이 각각 한 줄로 펴지고(703·627px) 남는 폭은 칸 사이 64px 거터 하나로
 * 수렴한다. 1440 에서 250px 로, 양 끝 배치보다도 61px 낮다.
 *
 * 비율(1.4fr_1fr 같은)로 두지 않는 이유는 1024 에서 오른쪽 칸이 345px 로 줄어
 * 421px 짜리 버튼 행이 넘치기 때문이다. auto 는 그 칸을 늘 버튼에 맞춘다.
 * minmax(0,1fr) 은 헤더가 쓰는 관용구이고 근거도 거기 적혀 있다(Header.tsx).
 *
 * [버튼 두 개] 밑에 [통화 가능 시간] 을 붙여 둔다. 전화를 걸라고 하면서 언제
 * 받는지 안 알려 주면 걸기 전에 망설이게 된다.
 */
export default function ContactCTA() {
  return (
    /* 평평한 네이비 한 장이다.

       전에는 위쪽 brand 선 + 기술 그리드 + 방사형 그라디언트가 얹혀 있었다.
       배너가 밝아지면서 이 블록이 사이트에서 유일한 색 면이 됐으므로, 장식을
       걷어도 면이 죽지 않는다 — 오히려 페이지 끝의 포인트로 또렷해진다.
       (위쪽 선은 PageHero 아래쪽 선과 호응하던 것인데, 그쪽이 없어졌다.)

       ⚠️ 2026-10-14 에 바탕색이 넷을 거쳤다(globals.css 머리 주석에 전말이
          있다). 예전 네이비 #0b3c8d 는 레드 버튼과 2.02:1 밖에 안 돼 버튼의
          모양을 제 테두리가 아니라 흰 글자가 떠받치고 있었다. 지금 dark 는
          3.38:1 로, 거쳐 온 넷 중 가장 높다.

       ⚠️ relative 는 아래 그레인 겹의 기준이다. 빼면 그레인이 페이지
          전체로 퍼진다.

       ⚠️ 이 주석을 JSX 주석({ /* ... *\/ })으로 바꾸지 말 것. return (
          바로 뒤에 두면 주석과 <section> 이 **자식 둘**이 되어
          "Expected ',', got 'ident'" 로 빌드가 깨진다. */
    <section className="relative overflow-hidden bg-dark">
      {/* 배경 격자. 띠 **전체**에 깔린다.

          ⚠️⚠️ **사용자가 고른 모양 그대로다.** 2026-10-14 에 모서리 괄호 틀 +
             네모 세 묶음 + 격자를 함께 깔았더니 이렇게 말했다 —

               "네모 3개 큰 거 빼고, 위에 2개 아래 2개 있는 ㄱ ㄴ 테두리
                이거 굵을 것도 빼고, **작은 네모 여러 개 있는 것만** 가지고
                **전체 감싸면** 이뻐 보이네"

             그래서 괄호 넷과 네모 세 묶음을 걷고 격자만 남겼다. 왼쪽
             665px 짜리이던 것을 inset-0 으로 **전폭**으로 폈다.
             ⚠️ 괄호·네모를 되살리지 말 것.

          ⚠️⚠️ **여기 오기까지 제품 도면을 네 번 걸었다가 전부 걷었다** —
             진동기 4호 평면도 한 장 · 볼피더 정면도 · 볼피더+직진피더+호퍼 ·
             진동기 네 기종. 앞의 셋은 "뒤에 볼피더인지 뭔지 모르겠다", 넷째는
             "이미 진동기가 메인 페이지에 있다" 였다. **이 띠는 1280x250
             (약 5:1)이라 어떤 제품 도면도 풀샷으로 크게 들어가지 않는다.**
             제품 그림을 다시 꺼내지 말 것.

          ⚠️⚠️ **한때 "기술 그리드 + 방사형 그라디언트" 가 있었고 걷어 냈다.**
             위 머리 주석에 그 전말이 있다("장식을 걷어도 면이 죽지 않는다").
             지금 격자는 그 판단을 뒤집는 것이 아니라, 그 뒤에 "아무 이미지
             없으면 심심해서 안 이쁘다" 는 말을 듣고 제품 그림을 네 번
             시도하다 **사용자가 직접 고른** 자리다. 걷으려면 그 말부터 볼 것.

          ⚠️ 인라인 svg 다. 파일로 두면 선 색을 CSS 로 못 바꾼다 —
             currentColor 라 text-white 를 그대로 받는다.

          ⚠️ **버튼 뒤에도 깔린다.** "전체 다 감싸도 괜찮아 보인다" 는 말이라
             그대로 둔다. 지금까지 지켜 온 "오른쪽은 버튼 자리라 비운다" 는
             **그림**에 대한 규칙이었다 — 격자는 글자를 가리지 않는다.

          ⚠️ 불투명도가 0.1 이다. 0.16(괄호·네모와 함께 쓰던 값)으로 두면
             전폭이 되면서 칸 수가 늘어 **버튼 글자가 지저분해 보인다.**

          ⚠️ 자리가 **그레인보다 앞**이다. 그레인이 이 위에도 얹혀야 한 면으로
             읽힌다.

          ⚠️ **모든 폭에서 보인다.** 1024 아래에서 감추던 것은 **그림**이
             글 위로 올라왔기 때문인데 격자는 그런 일이 없다. */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full text-white opacity-[0.1]"
      >
        <defs>
          <pattern
            id="cta-grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M40 0H0V40"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#cta-grid)" />
      </svg>
      {/* ⚠️ 그레인이 Container **앞**에 있다. DOM 순서상 글자가 위로 온다.
             단색 면이라 히어로(0.08)보다 진하게 0.12 를 준다. */}
      <div
        aria-hidden="true"
        className="grain pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-overlay"
      />
      {/* 푸터와 같은 wide 폭이다 — 헤더·CTA·푸터가 한 줄로 서고, 그 사이
          본문만 읽기 좋은 폭으로 안쪽에 들어간다.

          여기서는 폭이 줄바꿈까지 가른다. 1440 기준으로 content(1152)면 왼
          칸이 603px 라 제목이 575/120, 본문이 529/93 토막이 되고 높이도
          311px 다. wide(1280)면 왼 칸이 731px 가 되어 제목 703·본문 627 이
          각각 한 줄에 들어가고 250px 로 낮아진다. */}
      <Container width="wide" className="py-14 sm:py-20">
        <div className="flex flex-col items-start gap-8 lg:grid lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-16">
          <Reveal>
            <h2 className="text-2xl font-bold leading-snug text-white sm:text-3xl">
              공급할 부품을 보내 주시면
              {/* 왼 칸이 703px 이상일 때만 제목이 한 줄에 들어가고, 그
                  경계가 거의 정확히 xl(1280)이다. 그 아래에서는 줄바꿈을
                  켜 둬야 329/366 으로 균형이 잡힌다 — 끄면 1152 에서
                  575/120 짜리 토막이 된다. */}
              <br className="hidden sm:block xl:hidden" /> 맞는 피더를 설계해
              드립니다.
            </h2>
            {/* 본문은 제목이 말하지 않은 것만 맡는다 — 보내면 무엇이
                돌아오는지.

                한때 앞에 "공급할 부품 하나만 보내 주시면 됩니다." 가 더
                있었는데, 바로 위 제목("공급할 부품을 보내 주시면 맞는 피더를
                설계해 드립니다")을 거의 그대로 되풀이하는 문장이었다.

                그보다 전에는 "형상을 분석해 제작 가능 여부와 예상 일정을
                회신드립니다" 였다. 그 글자가 /contact 배너 lead 와 검색
                설명에도 그대로 있어서, 이 CTA(= /contact 를 뺀 9개 페이지)를
                보고 문의하기로 넘어간 사람이 같은 문장을 두 번 읽었다.
                (/contact 배너는 그 뒤 "샘플이나 도면 한 장이면 됩니다" 로
                다시 써서 지금은 겹치지 않는다.)

                ⚠️ "만들 수 있는지" 라고 쓰지 말 것. 한때 그랬는데 "못 만드는
                   것도 있다" 로 읽힌다는 말을 들었다. 만드는 것은 전제로 두고
                   **어떻게 · 얼마나** 만 알린다. 같은 뜻의 말이 네 자리에 있어
                   함께 고쳤다 — company.ts 의 process 01 output, /contact 의
                   배너 lead 와 검색 설명, README 자료 요청 16번.

                폭 제한(max-w-sm + md:max-w-none)은 글이 길던 때의 장치다.
                지금은 한 문장뿐이라 320~1440 어느 폭에서도 한 줄이고, 캡이
                걸리는 640~767 에서도 자연 폭(366px)이 캡(384px)보다 좁아
                실제로는 아무것도 자르지 않는다. 글을 다시 늘리면 그때
                일하므로 남겨 둔다.

                (글이 두 문장이던 때는 1152~1269 구간에서 둘째 줄이 93~205px
                 짜리 토막이 됐다. 캡으로는 못 막던 문제인데, 문장을 하나
                 줄이면서 같이 사라졌다.) */}
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70 sm:text-base md:max-w-none">
              어떻게 만들지, 얼마나 걸리는지 정리해 회신드립니다.
            </p>
          </Reveal>

          {/* 통화 시간 줄은 첫 버튼의 왼쪽 모서리에 세운다(items-start).
              오른쪽 끝에 맞추면 두 버튼 사이 어디에도 안 붙어 보인다. */}
          <Reveal
            delay={120}
            className="flex w-full flex-col items-start gap-3.5 sm:w-auto"
          >
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              {/* ⚠️ transition(전체)이다. transition-colors 로 두면 색만
                     전환되어 active:scale 이 딱딱 끊긴다 — 이 파일이 한동안
                     그랬다. */}
              {/* ⚠️ **화살표를 다시 넣지 말 것.** 2026-10-14 에 걷었다 —
                     홈 히어로의 "제품 살펴보기" 와 같은 날 함께 걷힌 자리다.
                     상자 모양이 이미 "누를 곳" 이라고 말한다.
                 ⚠️ group 과 gap-2 도 함께 걷었다 — group 은 화살표의
                    group-hover:translate-x-1 하나만 쓰던 것이다. */}
              <MagneticLink
                href="/contact"
                className="inline-flex items-center justify-center rounded-xl bg-brand px-6 py-4 text-15 font-semibold text-white transition hover:bg-brand-dark active:scale-[0.98] sm:px-8"
              >
                온라인 문의하기
              </MagneticLink>
              {/* 아이콘과 자릿수 정렬은 헤더 전화 링크와 같은 모양으로 맞춘다 */}
              <a
                href={telHref(site.tel)}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/45 px-6 py-4 text-15 font-semibold tabular-nums text-white transition hover:border-white/70 hover:bg-white/10 active:scale-[0.98] sm:px-8"
              >
                <PhoneIcon />
                전화 {site.tel}
              </a>
            </div>
            {/* white/70 이 이 바탕 위에서 8.9:1 이다(예전 네이비 때는 5.88:1).
                크기를 낮춰 아래 단계로 읽히게 하는 쪽을 그대로 둔다. */}
            <p className="text-xs leading-relaxed text-white/70">
              {site.hours.weekday} · {site.hours.holiday}
            </p>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
