import type { Metadata } from "next";
import ContactCTA from "@/components/ContactCTA";
import OrgChart from "@/components/OrgChart";
import PageHero from "@/components/PageHero";
import Section from "@/components/Section";
import { philosophy, philosophyMotto } from "@/data/company";

export const metadata: Metadata = {
  title: "조직도",
  description:
    "설계·가공·튜닝·조립을 모두 사내에 둔 유신 F.A 시스템의 조직 구성과, 사회복지·연구개발 두 갈래의 경영이념입니다.",
};

export default function VisionPage() {
  return (
    <>
      <PageHero
        eyebrow="ORGANIZATION & VISION"
        title="조직도"
        lead="설계부터 튜닝까지 한 공장 안에서 끝내는 구성, 그리고 그 안에서 지키려는 것."
      />

      {/* 상단 배너 h1이 이미 "조직도"다. 섹션에 같은 제목과 eyebrow를 또 달면
          같은 말을 세 번 하는 셈이라, 설명 한 줄만 남기고 바로 조직도를 보여 준다. */}
      <Section
        lead="설계·가공·튜닝·조립을 모두 사내에 두어 외주 없이 제작이 끝납니다. 문제가 생겨도 공정 사이에서 책임이 떠다니지 않습니다."
      >
        <OrgChart />
      </Section>

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

      <ContactCTA />
    </>
  );
}
