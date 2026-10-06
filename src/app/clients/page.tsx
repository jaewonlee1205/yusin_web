import type { Metadata } from "next";
import ClientGrid from "@/components/ClientGrid";
import ContactCTA from "@/components/ContactCTA";
import PageHero from "@/components/PageHero";
import Section from "@/components/Section";
import { clientIndustries, clients, totalClients } from "@/data/clients";

export const metadata: Metadata = {
  title: "납품실적",
  description: `LS산전, 린나이 코리아, 보령제약, 한국단자공업 등 ${totalClients}개사에 파츠피더를 납품해 온 유신 F.A 시스템의 주요 거래처입니다.`,
};

export default function ClientsPage() {
  return (
    <>
      {/* 전에는 "언제나 저희 제품을 이용하여 주심에 깊은 감사를 드립니다" 였다.
          회사 소개 PPT 의 인사말이 그대로 넘어온 것이라, 실적 페이지 배너가
          실적 대신 인사를 하고 있었다. 숫자는 totalClients 에서 뽑는다. */}
      <PageHero
        eyebrow="CLIENTS"
        title="납품실적"
        lead={`${totalClients}개사의 생산 라인에서 유신이 만든 피더가 돌고 있습니다.`}
      />

      <Section
        eyebrow="ALL CLIENTS"
        title={`주요 거래처 ${totalClients}개사`}
        lead="전기·전자부품부터 제약, 화장품 용기까지. 부품의 성격이 다르면 피더도 달라집니다."
      >
        <ClientGrid names={clients} />

        <p className="mt-6 text-xs leading-relaxed text-muted">
          위 목록은 회사 소개 자료 기준이며 가나다순이 아닙니다.
          각 사의 상호는 납품 당시 표기를 따랐습니다.
        </p>
      </Section>

      <Section
        tone="surface"
        eyebrow="BY INDUSTRY"
        title="산업별 납품 분야"
        lead="아래 분야에서 쌓은 제작 사례를 가지고 있습니다. 비슷한 부품을 다뤄 본 경험이 곧 시행착오를 줄입니다."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {clientIndustries.map((industry) => (
            <div
              key={industry.name}
              className="rounded-2xl bg-white p-6 shadow-card"
            >
              <h3 className="text-base font-bold text-ink">{industry.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {industry.examples}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <ContactCTA />
    </>
  );
}
