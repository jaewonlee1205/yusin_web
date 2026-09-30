import type { Metadata } from "next";
import ContactCTA from "@/components/ContactCTA";
import OrgChart from "@/components/OrgChart";
import PageHero from "@/components/PageHero";
import Section from "@/components/Section";

export const metadata: Metadata = {
  title: "조직도",
  description:
    "영업마케팅부·설계부·가공부·튜닝부·조립부를 모두 자체 보유한 유신 F.A 시스템의 조직 구성입니다. 외주 없이 한 공장 안에서 제작이 끝납니다.",
};

export default function VisionPage() {
  return (
    <>
      <PageHero
        eyebrow="ORGANIZATION"
        title="조직도"
        lead="문의 접수부터 진동 튜닝까지, 다섯 부서가 한 공장 안에서 이어집니다."
      />

      {/* 배너와 다른 이름을 쓴다. 하위 페이지는 전부 이 규칙이다 —
          보유 설비는 BY PROCESS/공정별 보유 설비, 납품실적은
          BY INDUSTRY/산업별 납품 분야. 같은 말을 두 번 하지 않으면서
          이 섹션이 무엇을 보여 주는지 밝힌다.
          "역할"인 이유 — 도표에서 부서마다 맡은 일이 아래 네모로 달려 있다
          (설계부 밑에 "부품 분석" "볼 형상 설계" "정렬 지그"). 도표가 곧
          설명이라 lead 는 두지 않는다. */}
      <Section eyebrow="BY DEPARTMENT" title="부서별 역할">
        <OrgChart />
      </Section>

      <ContactCTA />
    </>
  );
}
