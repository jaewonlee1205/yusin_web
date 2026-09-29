import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ContactCTA from "@/components/ContactCTA";
import PageHero from "@/components/PageHero";
import Section from "@/components/Section";
import { intro, meaning, overview } from "@/data/company";
import { yearsInBusiness } from "@/data/site";

export const metadata: Metadata = {
  title: "회사소개",
  description: `1992년 설립 이후 ${yearsInBusiness}년간 파츠피더 한 분야만 만들어 온 유신 F.A 시스템입니다. 회사 소개와 개요, 사명 有信의 뜻을 담았습니다.`,
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
          왼쪽 글 · 오른쪽 사진. 예전에는 오른쪽에 有信 카드를 세워 뒀는데
          카드가 글보다 228px 짧아 그 아래가 뚫려 보였다. 사진은 반대로 글보다
          크므로 items-center 로 글을 세로 가운데에 맞춘다.
        */}
        <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-16">
          <div>
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

          {/* 홈 제품 격자에 안 쓰인 유일한 볼피더 실물 사진.
              원본이 756x567 이라 이보다 크게 쓰면 흐려진다. */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-line bg-surface">
            <Image
              src="/images/products/bowl-feeder-02.webp"
              alt="스테인리스 볼피더 본체. 나선형 트랙을 따라 금속 부품이 정렬되어 올라가고, 트랙 옆으로 선별용 에어 노즐이 늘어서 있다."
              fill
              sizes="(min-width: 1024px) 32rem, 100vw"
              className="object-cover"
            />
          </div>
        </div>

        {/* 사명 풀이. 회사 소개의 마무리라 네이비로 무게를 준다.
            질감은 상단 배너·하단 CTA 와 같은 tech-grid 를 쓴다. */}
        <div className="relative mt-12 overflow-hidden rounded-lg bg-navy-deep p-8 sm:mt-16 sm:p-10">
          <div
            aria-hidden="true"
            className="tech-grid pointer-events-none absolute inset-0 opacity-[0.08]"
          />
          <div className="relative grid gap-5 sm:grid-cols-[auto_1fr] sm:items-baseline sm:gap-10">
            <p className="text-5xl font-bold leading-none text-brand-light sm:text-6xl">
              {meaning.hanja}
            </p>
            <div>
              <p className="text-lg font-bold text-white sm:text-xl">
                {meaning.headline}
              </p>
              <p className="mt-3 max-w-3xl text-base leading-[1.9] text-white/75">
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
