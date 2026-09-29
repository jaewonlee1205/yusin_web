import type { Metadata } from "next";
import Image from "next/image";
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
      <Section eyebrow="ABOUT" title={intro.title}>
        {/*
          왼쪽 글 · 오른쪽 사진. 사진이 글보다 크므로 items-center 로 글을
          세로 가운데에 맞춘다.
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
      </Section>

      {/* 경영이념 — 조직도 페이지보다 회사 개요 바로 밑이 어울린다.
          다음 페이지 카드를 이 뒤로 보내, 배경이 회색 → 네이비 → 흰색 → 네이비로
          번갈아 네이비 두 블록이 맞닿지 않는다. */}
      <Section
        tone="navy"
        eyebrow="MANAGEMENT PHILOSOPHY"
        title={philosophyMotto}
        lead="사회복지와 연구개발, 두 갈래로 지켜 온 경영이념입니다."
      >
        <div className="grid gap-px overflow-hidden rounded-lg bg-white/10 sm:grid-cols-2">
          {philosophy.map((p) => (
            <div key={p.title} className="bg-navy-deep p-8 sm:p-10">
              <h3 className="text-xl font-bold text-brand-light">{p.title}</h3>
              <p className="mt-4 text-sm leading-[1.9] text-white/70">
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* 회사소개 그룹의 나머지 두 페이지로 가는 길 */}
      <Section>
        <div className="grid gap-4 sm:grid-cols-2">
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
