import type { Metadata } from "next";
import Link from "next/link";
import ContactCTA from "@/components/ContactCTA";
import PageHero from "@/components/PageHero";
import Section from "@/components/Section";
import { intro, meaning, overview } from "@/data/company";
import { yearsInBusiness } from "@/data/site";

export const metadata: Metadata = {
  title: "회사소개",
  description: `1992년 설립 이후 ${yearsInBusiness}년간 파츠피더 한 분야만 만들어 온 유신 F.A 시스템입니다. 대표 인사말과 회사 개요, 사명 有信의 뜻을 담았습니다.`,
};

export default function CompanyPage() {
  return (
    <>
      <PageHero
        eyebrow="COMPANY"
        title="회사소개"
        // 有信 해석은 아래 본문 카드가 맡는다. 배너에서 같은 말을 또 하지 않는다.
        lead={`1992년 설립 이후 ${yearsInBusiness}년간, 파츠피더 한 분야만 만들어 온 회사입니다.`}
      />

      {/* 회사 소개글 */}
      <Section eyebrow="ABOUT" title={intro.title}>
        {/*
          한 단으로 쌓는다. 예전에는 오른쪽에 有信 카드를 세워 뒀는데, 카드가
          본문보다 228px 짧아 그 아래가 뚫려 보였다. 한 단이라고 컨테이너 폭을
          다 쓰면 한 줄이 70자를 넘어 눈이 다음 줄을 못 찾으므로 읽기 좋은
          폭으로 묶고, 남는 오른쪽은 여백으로 둔다.
        */}
        <div className="max-w-3xl">
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

        {/* 사명 풀이 — 본문과 같은 폭으로 꽉 채운 가로 블록 */}
        <div className="mt-12 rounded-lg border border-line bg-surface p-8 sm:mt-16 sm:p-10">
          <div className="grid gap-5 sm:grid-cols-[auto_1fr] sm:items-baseline sm:gap-10">
            <p className="text-5xl font-bold leading-none text-navy sm:text-6xl">
              {meaning.hanja}
            </p>
            <div>
              <p className="text-lg font-bold text-ink sm:text-xl">
                {meaning.headline}
              </p>
              <p className="mt-3 max-w-3xl text-base leading-[1.9] text-ink-soft">
                {meaning.body}
              </p>
            </div>
          </div>
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

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <NextCard
            href="/company/vision"
            label="조직도"
            desc="설계·가공·튜닝·조립을 모두 사내에 둔 조직 구성과, 회사가 지키려는 두 가지 방향."
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
