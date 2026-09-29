import type { Metadata } from "next";
import Container from "@/components/Container";
import ContactCTA from "@/components/ContactCTA";
import PageHero from "@/components/PageHero";
import ProductBrowser from "@/components/ProductBrowser";
import { feederDefinition } from "@/data/products";

export const metadata: Metadata = {
  title: "제품",
  description:
    "볼피더, 직진피더, 진동기, 호퍼피더, 방음커버, 컨트롤러, 우레탄 코팅 — 유신 F.A 시스템이 직접 제작하는 파츠피더 전 라인업입니다.",
};

export default function ProductsPage() {
  return (
    <>
      <PageHero
        eyebrow="PRODUCTS"
        title="제품"
        lead="피더 본체부터 이송·보충·제어·방음까지 직접 제작합니다."
      />

      <div className="py-16 sm:py-24">
        <Container>
          {/* 피더가 뭔지 모르는 방문자를 위한 한 문단. 배너에 넣으면 문구가 길어
              배너 높이가 다른 페이지와 어긋나서 본문 맨 위로 뺐다. */}
          <div className="mb-10 rounded-lg border-l-2 border-brand bg-surface px-6 py-5 sm:mb-14">
            <h2 className="text-sm font-bold tracking-[0.15em] text-ink">
              {feederDefinition.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              {feederDefinition.body}
            </p>
          </div>

          <ProductBrowser />

          <p className="mt-12 rounded-lg border border-line bg-surface px-6 py-5 text-sm leading-relaxed text-ink-soft">
            모든 제품은 공급할 부품에 맞춰 제작합니다. 정해진 표준 기종을
            고르는 방식이 아니라, 부품 샘플을 받아 형상을 분석한 뒤 볼 형상과
            정렬 지그를 새로 설계합니다. 기종별 상세 사양이 필요하시면 문의해
            주세요.
          </p>
        </Container>
      </div>

      <ContactCTA />
    </>
  );
}
