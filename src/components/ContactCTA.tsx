import Link from "next/link";
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
    <section className="relative overflow-hidden bg-navy">
      {/* 위쪽 brand 선. PageHero 아래쪽 선과 호응해 본문을 위아래로 감싼다. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-brand"
      />
      <div
        aria-hidden="true"
        className="tech-grid pointer-events-none absolute inset-0 opacity-[0.09]"
      />
      {/* 버튼 쪽에 깊이를 준다 — 평평한 네이비 한 장이면 면이 죽는다. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_90%_at_82%_30%,rgba(6,38,92,0.55),transparent_70%)]"
      />
      {/* 푸터와 같은 wide 폭이다 — 헤더·CTA·푸터가 한 줄로 서고, 그 사이
          본문만 읽기 좋은 폭으로 안쪽에 들어간다.

          여기서는 폭이 줄바꿈까지 가른다. 1440 기준으로 content(1152)면 왼
          칸이 603px 라 제목이 575/120, 본문이 529/93 토막이 되고 높이도
          311px 다. wide(1280)면 왼 칸이 731px 가 되어 제목 703·본문 627 이
          각각 한 줄에 들어가고 250px 로 낮아진다. */}
      <Container width="wide" className="relative py-14 sm:py-20">
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
            {/* 768 부터는 칸이 본문의 자연 폭(627px)보다 넓어 한 줄에 들어간다.
                그래서 거기서 폭 제한을 푼다(md:max-w-none).

                384px 캡은 640~767 구간에만 남긴다. 그 구간에서 캡을 풀면
                본문이 529/93 짜리 토막이 되는데, 캡이 있으면 369/253 으로
                제목이 줄바꿈하는 폭(366px)과 맞는다. 전에 max-w-xl(576px)을
                쓸 때 둘째 줄이 29%(175/576px)만 차 위는 길고 아래는 짧아
                보였던 것이 이 캡을 둔 이유다.

                1152~1269 에서는 칸이 588~700px 라 본문이 두 줄이 되고 둘째
                줄이 93~205px 로 짧다. 캡으로는 못 막는다 — 씌우면 1280 이상의
                한 줄이 깨진다. 폭 140px 짜리 구간이라 그대로 둔다.

                문구도 바꿨다. 전에 쓰던 "형상을 분석해 제작 가능 여부와 예상
                일정을 회신드립니다" 는 /contact 배너 lead 와 검색 설명에도
                글자 그대로 있었다. 이 CTA 는 /contact 를 뺀 9개 페이지에
                붙으므로, 여기서 보고 문의하기로 넘어간 사람이 같은 문장을 두
                번 읽었다. 같은 뜻을 쉬운 말로 옮겨 그 겹침을 없앴다.
                (/contact 배너 lead 는 그 뒤 다시 썼다 — 지금은 "샘플이나 도면
                한 장이면 됩니다" 로 시작해 이 문단과 겹치지 않는다. 한동안 이
                주석이 "부품 샘플이나" 로 인용하고 있었는데, 640px 한 줄을
                맞추려고 앞머리 "부품 " 을 덜어낸 뒤의 옛 글자였다.) */}
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70 sm:text-base md:max-w-none">
              공급할 부품 하나만 보내 주시면 됩니다. 만들 수 있는지, 얼마나
              걸리는지 정리해 회신드립니다.
            </p>
          </Reveal>

          {/* 통화 시간 줄은 첫 버튼의 왼쪽 모서리에 세운다(items-start).
              오른쪽 끝에 맞추면 두 버튼 사이 어디에도 안 붙어 보인다. */}
          <Reveal
            delay={120}
            className="flex w-full flex-col items-start gap-3.5 sm:w-auto"
          >
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Link
                href="/contact"
                className="group inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-6 py-4 text-[15px] font-semibold text-white transition-colors hover:bg-brand-dark sm:px-8"
              >
                온라인 문의하기
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="shrink-0 transition-transform group-hover:translate-x-1"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
              {/* 아이콘과 자릿수 정렬은 헤더 전화 링크와 같은 모양으로 맞춘다 */}
              <a
                href={telHref(site.tel)}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/45 px-6 py-4 text-[15px] font-semibold tabular-nums text-white transition-colors hover:border-white/70 hover:bg-white/10 sm:px-8"
              >
                <PhoneIcon />
                전화 {site.tel}
              </a>
            </div>
            {/* white/55 는 이 네이비 위에서 4.21:1 로 AA 에 못 미친다.
                white/70 이 5.87:1 이다. 크기를 낮춰 아래 단계로 읽히게 한다. */}
            <p className="text-xs leading-relaxed text-white/70">
              {site.hours.weekday} · {site.hours.holiday}
            </p>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
