import type { Metadata } from "next";
import ClientGrid from "@/components/ClientGrid";
import ContactCTA from "@/components/ContactCTA";
import PageHero from "@/components/PageHero";
import Section from "@/components/Section";
import { clients, totalClients } from "@/data/clients";

export const metadata: Metadata = {
  title: "납품실적",
  description: `LS산전, 린나이 코리아, 보령제약, 한국단자공업 등 ${totalClients}개사에 파츠피더를 납품해 온 유신 F.A 시스템의 주요 거래처입니다.`,
};

export default function ClientsPage() {
  return (
    <>
      {/* 전에는 "언제나 저희 제품을 이용하여 주심에 깊은 감사를 드립니다" 였다.
          회사 소개 PPT 의 인사말이 그대로 넘어온 것이라, 실적 페이지 배너가
          실적 대신 인사를 하고 있었다. 숫자는 totalClients 에서 뽑는다.

          그다음 "34개사의 생산 라인에서 유신이 만든 피더가 돌고 있습니다" 로
          고쳤는데, 그건 말맛이지 실적이 아니었다. 실적 페이지의 배너가 답할
          것은 언제부터.무엇을 다. 그래서 설립연도(1992년 6월 6일, company.ts 의
          overview)를 앞에 세우고 "생산 라인" 이라는 뭉뚱그린 말을 조립.검사
          라인으로 좁혔다.

          개수는 넣지 않는다 — 바로 아래 제목이 "주요 거래처 34개사" 라 배너가
          같은 숫자를 한 번 더 말하게 된다. */}
      <PageHero
        eyebrow="CLIENTS"
        title="납품실적"
        lead="1992년 설립 이후 조립·검사 라인의 부품 공급을 자동화해 왔습니다."
      />

      {/* 격자 하나뿐이다. 전에는 리드("전기·전자부품부터 제약, 화장품
          용기까지…")와 각주("위 목록은 회사 소개 자료 기준이며…")가 붙어
          있었고, 그 아래 "산업별 납품 분야" 섹션이 같은 거래처 이름을 산업별로
          한 번 더 늘어놓았다. 셋 다 걷었다 — 격자가 34개사를 이미 다 보여 주는
          자리에서 같은 말을 세 번 하고 있었다.

          clients.ts 의 clientIndustries 데이터는 남아 있다(미아라는 경고를
          그쪽에 적어 뒀다). */}
      <Section eyebrow="ALL CLIENTS" title={`주요 거래처 ${totalClients}개사`}>
        <ClientGrid names={clients} />
      </Section>

      <ContactCTA />
    </>
  );
}
