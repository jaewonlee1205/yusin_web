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
      {/* 열거하지 않고 제품들이 서로 어떻게 이어지는지를 말한다. 목록이 왜 이
          순서인지(정렬 → 이송 → 보충 → 구동 → 제어 → 환경)가 한 문장에 담긴다.

          전에는 "피더 본체부터 이송·보충·제어·방음까지 직접 제작합니다" 였는데
          홈 '제품 라인업' 섹션 lead 와 앞 열거구가 글자 단위로 같고 끝맺음도
          같았다 — 홈에서 들어온 사람이 같은 문장을 두 번 읽었다.

          열거를 그만둔 덕에 빠진 항목 문제도 없어졌다. 옛 문구는 다섯 가지만
          셌는데 카테고리는 여섯 개라 표면처리(우레탄 코팅)가 빠져 있었다.
          이제 제품이 늘어도 문구를 고칠 필요가 없다.

          "직접 제작" 은 쓰지 않는다. 화면에 이미 여러 번 있고, 이 페이지 하단
          문단이 "모든 제품은 공급할 부품에 맞춰 제작합니다" 로 그 주장을 맡는다.

          "정렬" 대신 "줄을 서서" 로 푼 것은 영상자료 lead("부품이 실제로
          정렬되어 나가는 속도와 움직임입니다")와 첫머리가 겹치지 않게 하려는
          것이다. 둘 다 메뉴에 있어 나란히 읽힌다.

          길이 주의 — PageHero 는 lead 에 두 줄 자리를 비워 둔다. 2줄을 넘기면
          배너가 다른 페이지와 어긋난다. 이 문구는 320~1440 모두 2줄이다. */}
      <PageHero
        eyebrow="PRODUCTS"
        title="제품"
        lead="부품이 들어와 줄을 서서 나가기까지, 그 길에 놓이는 장치들입니다."
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

          {/* 맺음말 문단은 이 안에 있다. 분류 사이드바가 생기면서 본문이
              오른쪽 칸으로 좁아졌는데, 제품에 대한 말이라 그리드와 같은
              기둥에 서야 한다. */}
          <ProductBrowser />
        </Container>
      </div>

      <ContactCTA />
    </>
  );
}
