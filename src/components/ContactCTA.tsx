import Link from "next/link";
import Container from "./Container";
import Reveal from "./Reveal";
import { PhoneIcon } from "./icons";
import { site, telHref } from "@/data/site";

/**
 * 페이지 하단 공통 문의 유도 블록. /contact 를 뺀 9개 페이지가 쓴다.
 *
 * 버튼은 lg 에서 본문 아랫변에 맞춘다(items-end). 세로 가운데에 두면 제목
 * 둘째 줄과 본문 사이 어중간한 높이에 떠 어디에도 안 붙어 보인다.
 *
 * 오른쪽은 [버튼 두 개] + [통화 가능 시간] 한 덩어리다. 전화를 걸라고 하면서
 * 언제 받는지 안 알려 주면 걸기 전에 망설이게 된다.
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
      {/* 푸터와 같은 wide 폭이다 — 헤더·CTA·푸터가 한 줄로 서고,
          그 사이 본문만 읽기 좋은 폭으로 안쪽에 들어간다. */}
      <Container width="wide" className="relative py-14 sm:py-20">
        <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-end lg:justify-between">
          <Reveal>
            <h2 className="text-2xl font-bold leading-snug text-white sm:text-3xl">
              공급할 부품을 보내 주시면
              <br className="hidden sm:block" /> 맞는 피더를 설계해 드립니다.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base">
              부품 샘플이나 도면, 필요한 공급 속도만 알려 주세요. 형상을 분석해
              제작 가능 여부와 예상 일정을 회신드립니다.
            </p>
          </Reveal>

          <Reveal
            delay={120}
            className="flex w-full shrink-0 flex-col items-start gap-3.5 sm:w-auto"
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
