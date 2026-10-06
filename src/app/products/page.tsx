import type { Metadata } from "next";
import Container from "@/components/Container";
import ContactCTA from "@/components/ContactCTA";
import PageHero from "@/components/PageHero";
import ProductBrowser from "@/components/ProductBrowser";

export const metadata: Metadata = {
  title: "제품",
  description:
    "볼피더, 직진피더, 진동기, 호퍼피더, 방음커버, 컨트롤러, 우레탄 코팅 — 유신 F.A 시스템이 직접 제작하는 파츠피더 전 라인업입니다.",
};

export default function ProductsPage() {
  return (
    <>
      {/* 열거하지 않는다. 더 전에 쓰던 "피더 본체부터 이송·보충·제어·방음까지
          직접 제작합니다" 는 홈 '제품 라인업' 섹션 lead 와 글자 단위로 겹쳤고,
          여섯 카테고리 중 다섯만 세어 표면처리(우레탄 코팅)가 빠져 있었다.
          제품이 늘어도 고칠 일이 없도록 한 가지 사실만 말한다.

          바로 전 문구는 "부품이 들어와 줄을 서서 나가기까지, 그 길에 놓이는
          장치들입니다" 였다. 뜻은 맞지만 피더가 무엇인지를 설명하는 말이라,
          고객사가 읽었을 때 이 회사가 무엇을 해 주는지가 먼저 오게 바꿨다.
          피더가 뭔지는 홈의 WHAT IS THE FEEDER 섹션이 맡는다.

          "직접 제작" 은 쓰지 않는다. 화면에 이미 여러 번 있다.

          길이 주의 — PageHero 는 lead 에 두 줄 자리만 비워 둔다. 세 줄이 되면
          이 배너만 232 -> 258px 로 커진다. 이 문구는 320~1440 모두 두 줄 안이다. */}
      <PageHero
        eyebrow="PRODUCTS"
        title="제품"
        lead="표준 기종을 고르는 것이 아니라, 부품에 맞춰 새로 설계합니다."
      />

      {/* 흰 바탕이다.

          한동안 bg-surface 였다. 흰 카드가 흰 바탕에 놓이면 테두리 1px 말고는
          경계가 없어 격자가 평평해 보인다는 이유였는데, 그 뒤 카드가
          shadow-card 를 갖게 되어 윤곽을 그림자가 맡는다(/videos./company 가
          이미 그 구조다).

          ⚠️ 회색으로 되돌리지 말 것. 배너(PageHero)가 네이비에서 bg-surface 로
             바뀌면서, 본문까지 회색이면 배너와 본문의 경계가 사라진다.
             여덟 페이지 가운데 이 페이지만 그 충돌이 있었다.

          홈 '제품 라인업' 섹션은 tone="surface" 그대로다 — 홈은 히어로가
          네이비라 같은 충돌이 없고, 회색 판 위의 카드도 그대로 선다. */}
      <div className="bg-white py-16 sm:py-24">
        <Container>
          {/* 전에는 여기 피더 정의 박스("본래 음식을 준다는 뜻의 feed에서
              온 말로 …")와, 목록 아래 맺음말 문단("모든 제품은 공급할 부품에
              맞춰 제작합니다 …")이 있었다. 둘 다 뺐다 — 이 페이지는 제품을
              훑어 고르는 자리고, 피더가 뭔지는 홈의 WHAT IS THE FEEDER
              섹션이 같은 데이터(feederDefinition)로 말한다. */}
          <ProductBrowser />
        </Container>
      </div>

      <ContactCTA />
    </>
  );
}
