import type { Metadata } from "next";
import ContactCTA from "@/components/ContactCTA";
import OrgChart from "@/components/OrgChart";
import PageHero from "@/components/PageHero";
import Section from "@/components/Section";

export const metadata: Metadata = {
  title: "조직도",
  description:
    "설계부·가공부·튜닝부·조립부를 모두 자체 보유한 유신 F.A 시스템의 조직 구성입니다. 외주 없이 한 공장 안에서 제작이 끝납니다.",
};

export default function VisionPage() {
  return (
    <>
      <PageHero
        eyebrow="ORGANIZATION"
        title="조직도"
        lead="부품 분석부터 진동 튜닝까지, 네 부서가 한 공장 안에서 이어집니다."
      />

      {/* 상단 배너 h1이 이미 "조직도"다. 섹션에 같은 제목과 eyebrow를 또 달면
          같은 말을 세 번 하는 셈이라, 설명 한 줄만 남기고 바로 조직도를 보여 준다.
          배너 lead 와 겹치지 않도록 여기는 뒷 문장만 둔다. */}
      <Section lead="문제가 생겨도 공정 사이에서 책임이 떠다니지 않습니다.">
        <OrgChart />
      </Section>

      <ContactCTA />
    </>
  );
}
