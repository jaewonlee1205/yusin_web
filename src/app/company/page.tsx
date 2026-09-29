import type { Metadata } from "next";
import Link from "next/link";
import ContactCTA from "@/components/ContactCTA";
import PageHero from "@/components/PageHero";
import Section from "@/components/Section";
import SubNav from "@/components/SubNav";
import { greeting, meaning, overview } from "@/data/company";
import { companyTabs } from "@/data/site";

export const metadata: Metadata = {
  title: "회사소개",
  description:
    "1992년 설립된 유신 F.A 시스템의 인사말과 회사 개요입니다. 신의가 있는, 신뢰가 있는 — 사명 그대로 30년을 지켜 왔습니다.",
};

export default function CompanyPage() {
  return (
    <>
      <PageHero
        eyebrow="COMPANY"
        title="회사소개"
        lead="신의가 있는, 신뢰가 있는. 사명 그대로 30년을 지켜 온 기업입니다."
      />
      <SubNav items={companyTabs} />

      {/* 인사말 */}
      <Section eyebrow="GREETING" title={greeting.title}>
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <div className="space-y-5">
            {greeting.paragraphs.map((p) => (
              <p
                key={p.slice(0, 20)}
                className="text-base leading-[1.9] text-ink-soft"
              >
                {p}
              </p>
            ))}
            <p className="pt-4 text-base font-bold text-ink">
              {greeting.signature}
            </p>
          </div>

          <aside className="self-start rounded-lg border border-line bg-surface p-8">
            <p className="text-5xl font-bold leading-none text-navy">
              {meaning.hanja}
            </p>
            <p className="mt-5 text-lg font-bold text-ink">{meaning.headline}</p>
            <p className="mt-4 text-sm leading-relaxed text-ink-soft">
              {meaning.body}
            </p>
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

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <NextCard
            href="/company/vision"
            label="조직도 · 경영이념"
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
