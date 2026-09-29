import type { Metadata } from "next";
import Link from "next/link";
import ContactCTA from "@/components/ContactCTA";
import PageHero from "@/components/PageHero";
import Section from "@/components/Section";
import {
  intro,
  overview,
  philosophy,
  philosophyMotto,
} from "@/data/company";
import { yearsInBusiness } from "@/data/site";

export const metadata: Metadata = {
  title: "회사소개",
  description: `1992년 설립 이후 ${yearsInBusiness}년간 파츠피더 한 분야만 만들어 온 유신 F.A 시스템입니다. 회사 소개와 개요, 사회복지·연구개발 두 갈래의 경영이념을 담았습니다.`,
};

export default function CompanyPage() {
  return (
    <>
      <PageHero
        eyebrow="COMPANY"
        title="회사소개"
        lead={`1992년 설립 이후 ${yearsInBusiness}년간, 파츠피더 한 분야만 만들어 온 회사입니다.`}
      />

      {/* 회사 소개글 */}
      {/*
        Section 에 eyebrow·title 을 넘기지 않고 직접 그린다. Section 은 제목을
        children 위의 별도 블록(mb-10 sm:mb-14)에 그리는데, 그러면 오른쪽 패널이
        제목보다 106px 아래에서 시작한다. 제목을 그리드 안으로 넣어야 패널 윗변이
        제목과 맞는다.

        eyebrow·h2 클래스는 src/components/Section.tsx 에서 그대로 옮겨 온 것이다.
        거기 타이포가 바뀌면 이 페이지도 같이 고쳐야 한다.
      */}
      <Section>
        <p className="mb-3 text-xs font-bold tracking-[0.2em] text-brand">
          ABOUT
        </p>
        {/* items-start 를 쓰지 않는다. 그리드 기본값(stretch)이라야 패널이 칸
            높이를 채워 아랫변까지 본문 끝과 맞는다. 윗변은 행이 제목에서
            시작하므로 stretch 로도 그대로 맞는다. */}
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
          <div>
            <h2 className="text-2xl font-bold leading-snug tracking-tight text-ink sm:text-4xl">
              {intro.title}
            </h2>
            {/* 제목 아래 여백은 Section 의 헤더 아래 여백과 같은 값으로 맞춘다 */}
            <div className="mt-10 sm:mt-14">
              {intro.paragraphs.map((paragraph, index) => (
                <p
                  key={paragraph.slice(0, 20)}
                  className={
                    // 첫 문단만 키워 소개글이 어디서 시작하는지 잡아 준다.
                    index === 0
                      ? "text-lg leading-[1.85] text-ink sm:text-xl"
                      : "mt-5 text-base leading-[1.9] text-ink-soft"
                  }
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* 경영이념. 라벨을 한글로 둔 것은 의도다 — 섹션 eyebrow 가 이미
              영문(ABOUT)이라 패널 안에 MANAGEMENT PHILOSOPHY 를 또 두면
              한 섹션에 영문 라벨이 둘이 된다. */}
          <aside className="rounded-lg bg-navy-deep p-7 sm:p-8">
            <p className="text-xs font-bold tracking-[0.2em] text-brand-light">
              경영이념
            </p>
            <p className="mt-3 text-xl font-bold leading-snug text-white sm:text-2xl">
              {philosophyMotto}
            </p>
            <dl className="mt-6 space-y-5 border-t border-white/15 pt-6">
              {philosophy.map((item) => (
                <div key={item.title}>
                  <dt className="text-sm font-bold text-brand-light">
                    {item.title}
                  </dt>
                  <dd className="mt-1.5 text-sm leading-[1.8] text-white/75">
                    {item.body}
                  </dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </Section>

      {/* 회사 개요 */}
      <Section tone="surface" eyebrow="OVERVIEW" title="회사 개요">
        <dl className="overflow-hidden rounded-lg border border-line bg-white">
          {overview.map((row) => (
            <div
              key={row.label}
              className="flex flex-col border-b border-line last:border-0 sm:flex-row"
            >
              <dt className="bg-surface px-6 py-4 text-sm font-bold text-ink sm:w-44 sm:shrink-0">
                {row.label}
              </dt>
              <dd className="px-6 py-4 text-sm leading-relaxed text-ink-soft">
                {row.value}
              </dd>
            </div>
          ))}
        </dl>

        {/* 회사소개 그룹의 나머지 두 페이지로 가는 길 */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <NextCard
            href="/company/vision"
            label="조직도"
            desc="설계부·가공부·튜닝부·조립부를 모두 자체 보유한 조직 구성."
          />
          <NextCard
            href="/company/facility"
            label="보유 설비"
            desc="밀링·선반·용접기 등 21종 55대. 특수 형상도 외주 없이 직접 가공합니다."
          />
        </div>
      </Section>

      <ContactCTA />
    </>
  );
}

function NextCard({
  href,
  label,
  desc,
}: {
  href: string;
  label: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col rounded-lg border border-line bg-white p-6 transition-colors hover:border-navy/30"
    >
      <span className="flex items-center justify-between gap-3">
        <span className="text-base font-bold text-ink group-hover:text-brand">
          {label}
        </span>
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
          className="shrink-0 text-muted transition-transform group-hover:translate-x-1 group-hover:text-brand"
        >
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </span>
      <span className="mt-2 text-sm leading-relaxed text-ink-soft">{desc}</span>
    </Link>
  );
}
