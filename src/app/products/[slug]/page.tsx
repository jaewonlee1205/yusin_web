import type { Metadata } from "next";
import Link from "next/link";
import { Fragment } from "react";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import Container from "@/components/Container";
import ContactCTA from "@/components/ContactCTA";
import ProductGallery from "@/components/ProductGallery";
import ApplicationCases from "@/components/ApplicationCases";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import Section from "@/components/Section";
import {
  getProduct,
  products,
  type ApplicationCase,
  type Product,
} from "@/data/products";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};

  // 검색 설명은 summary 가 아니라 lead 에서 가져온다. summary 는 히어로 한 줄
  // 요약이라 30자 안팎이고, 검색 결과 설명으로는 너무 짧다. lead 는 90~110자라
  // 그 자리에 알맞다.
  return {
    title: `${product.name} (${product.nameEn})`,
    description: product.lead,
    openGraph: {
      title: `${product.name} | 유신 F.A 시스템`,
      description: product.lead,
      images: [{ url: product.images[0].src }],
    },
  };
}

/**
 * 제품 상세.
 *
 * 이 페이지만 PageHero(네이비 배너)를 쓰지 않는다. 배너를 두면 제품명이
 * 배너 h1 · 빵부스러기 · 본문 h2 로 세 번 나오고, 머리에만 288px 를 쓴다.
 * 목록 페이지(제품·회사소개·납품실적 등 8개)는 배너를 그대로 쓴다 — 거기는
 * "무엇을 모아 둔 곳인지" 를 말해야 하지만, 상세는 제품 하나를 파는 자리라
 * 사진과 문의 버튼이 먼저 와야 한다.
 */
export default async function ProductDetailPage({
  params,
}: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  // 아래 "다른 제품" 에 띄울 목록. 제품마다 개수가 다르다 — 지금 2~3개다.
  //
  // 전에는 목록을 돌려 가며 셋씩 뽑았다(products[(here + 1..3) % 7]). 일곱
  // 제품이 정확히 3회씩 나와 분포는 고르지만, 칸을 채우려고 관련 없는 제품도
  // 끌어왔다 — 우레탄 코팅 아래에 방음커버가 놓이는 식이다. 이제 products.ts
  // 의 related 를 그대로 읽는다. 근거는 각 제품 specs 에 적힌 연결 관계다.
  //
  // 그래도 한 번도 안 나오는 제품은 없다. 18칸의 등장 횟수는 볼피더 6 ·
  // 직진피더 4 · 컨트롤러 3 · 호퍼피더 2 · 진동기 1 · 방음커버 1 · 우레탄
  // 코팅 1 이다. 볼피더가 여섯인 것은 나머지 여섯이 전부 볼피더에 붙는
  // 물건이기 때문이라 숨길 일이 아니다(전에 고치려던 문제는 세 제품이 21칸
  // 중 0회였던 것이다).
  //
  // slug 오타는 products.ts 끝의 검사가 빌드 때 잡는다. 여기서는 타입을
  // 좁히려고 걸러 낸다.
  const related = product.related
    .map((slug) => getProduct(slug))
    .filter((p): p is Product => p !== undefined);

  return (
    <>
      <Breadcrumb
        trail={[
          { href: "/", label: "홈" },
          { href: "/products/", label: "제품" },
        ]}
        current={product.name}
      />

      {/* 제품 히어로 — 사진과 "무엇인지", 그리고 문의 버튼까지 첫 화면에 */}
      <div className="py-12 sm:py-16">
        <Container>
          {/* 오른쪽 칸을 왼쪽 사진에 줄 맞춘다.

              lg:items-start 를 빼 오른쪽 칸이 왼쪽 높이까지 늘어나게 하고,
              아래 사양 표 블록에 lg:mt-auto 를 줘 표와 버튼을 한 덩어리로
              바닥에 붙인다. 그러면 1280 이상에서 표 바닥이 큰 사진 바닥과,
              버튼 바닥이 썸네일 줄 바닥과 같은 선에서 끝난다.

              왼쪽 높이는 두 가지다 — 사진이 여러 장이면 468px(사진 384 +
              간격 12 + 썸네일 72), 한 장이면 썸네일 줄이 없어 384px 다
              (ProductGallery 참고). 사진이 한 장인 셋(진동기.호퍼피더.
              컨트롤러)은 오른쪽 칸이 438.6px 로 왼쪽보다 길어 mt-auto 가 0 이
              된다 — 맞출 상대가 없으니 그대로 흐른다.

              lg 미만은 한 칸으로 쌓이므로 flex 도 auto 마진도 일을 하지 않는다. */}
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <ProductGallery images={product.images} />

            <div className="lg:flex lg:flex-col">
              {/* 분류 배지. 점 하나로 레드를 아주 좁게만 쓴다.

                  self-start 가 필요하다. 이 칸이 lg 에서 flex-col 이라 플렉스
                  칸의 기본 align-items:stretch 가 걸리는데, 그러면 inline-flex
                  짜리인 이 배지가 내용 폭(93px)이 아니라 칸 폭(1024 에서 440,
                  1280 이상에서 512px)까지 늘어난다. 같은 칸의 다른 자식은
                  블록이라 늘어나는 것이 맞고, 배지만 내용 크기로 둔다.
                  lg 미만에서는 부모가 플렉스가 아니라 이 한 줄이 무시된다. */}
              <p className="inline-flex self-start items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5 text-xs font-bold tracking-[0.1em] text-ink-soft">
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full bg-brand"
                />
                {product.category}
              </p>

              {/* 배너가 없으므로 제품명이 h1 이다. 검색에도 이쪽이 맞다. */}
              <h1 className="mt-4 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                {product.name}
              </h1>
              <p className="mt-2 text-sm font-medium uppercase tracking-[0.15em] text-muted">
                {product.nameEn}
              </p>

              <p className="mt-6 text-lg font-medium leading-relaxed text-ink">
                {product.summary}
              </p>

              {/* 히어로 사양 표 — specs 앞 세 줄이다. 아래 사양 표는 slice(3)
                  로 뒤 세 줄만 쓴다. 같은 줄이 두 번 나오지 않는다.

                  "주요 사양" 라벨은 두지 않는다. 표가 아래 "제작 사양" 과 같은
                  짜임(격자선 + 회색 라벨 칸)이 되면서 그 자체로 사양표로 읽혀,
                  라벨은 같은 말을 한 번 더 하는 16px + 간격 12px 였다.

                  전에는 이 자리에 features.title 을 넣었는데, 아래 FEATURES
                  섹션의 제목 네 개와 글자까지 100% 같았다. 히어로는 "이 제품이
                  무엇인가"(주요 내용)를, 아래는 "왜 좋은가"(특징)를 맡아야
                  하므로 축을 사양으로 바꿨다.

                  그 전에는 lead 문단(3줄)이었다. lead 는 데이터에 남아
                  generateMetadata 의 검색 설명으로 쓰인다 — 화면에서만 빠졌다.

                  참고로 받은 신창에프에이 LSP 호퍼피더의 히어로 박스를 쟀다 —
                  568x208 에 라벨 + 특징 네 줄이었다. 우리는 그 자리를 사양으로
                  채우고 라벨 없이 표만 둔다.

                  값은 어느 폭에서나 한 줄이다. 13px 로 재면 앞 세 줄 21개의
                  가장 긴 것이 246px("스테인리스, 알루미늄 (부품 특성에 따라
                  선정)")이고, 값 칸이 가장 좁아지는 1024(308px)에도 들어간다.
                  라벨은 가장 긴 것이 63px("거칠기 등급")라 5rem(80px)에 든다.

                  dt/dd 는 dl 직계여야 한다(접근성 검사 dlitem). 묶는 div 대신
                  Fragment 를 쓴다 — 아래 사양 표와 같은 이유다. */}
              <div className="mt-6 lg:mt-auto">
                {/* 아래 "제작 사양" 표와 같은 짜임이다 — gap-px + bg-line 격자선,
                    dt bg-surface / dd bg-white, 테두리 + 둥근 모서리 +
                    overflow-hidden.

                    전에는 회색 카드 안에 border-t 만 둔 표였는데, 셀 좌우 패딩이
                    0 이고 카드의 px-5 가 대신하는 구조라 선이 안쪽 20px 에서
                    시작해 20px 전에 끝났다. 아래 표는 선이 테두리까지 닿는다 —
                    그 차이 때문에 히어로 쪽만 표 같기도 하고 아닌 것 같기도
                    했다. 테두리를 표 자신이 가지게 하면서 왼쪽 갤러리 이미지
                    박스와도 좌우 끝.테두리색.모서리가 같아진다.

                    크기만 아래 표보다 작다. 라벨 칸 6rem(아래는 9rem), 글자
                    12/13px(14px), 패딩 px-4(px-5). 6rem 은 글상자 64px 로,
                    가장 긴 라벨("거칠기 등급", 12px bold 약 58px)이 든다.

                    높이는 행 52px x 3 + 격자선 2 = 158px 다. 라벨을 걷으면서
                    블록이 186 -> 158px 가 되어 1280 이상에서 오른쪽 칸이
                    갤러리보다 그만큼 짧아진다 — 둘 다 같은 Container 안이라
                    아래쪽 여백만 조금 생기고 어긋나 보이지는 않는다. */}
                <dl className="grid grid-cols-[6rem_minmax(0,1fr)] gap-px overflow-hidden rounded-lg border border-line bg-line">
                  {product.specs.slice(0, 3).map((spec) => (
                    <Fragment key={spec.label}>
                      <dt className="bg-surface px-4 py-4 text-xs font-bold text-ink">
                        {spec.label}
                      </dt>
                      <dd className="bg-white px-4 py-4 text-[13px] leading-relaxed text-ink-soft">
                        {spec.value}
                      </dd>
                    </Fragment>
                  ))}
                </dl>
              </div>

              {/* 버튼 둘. 보던 제품이 아니면 목록으로 돌아갈 길을 같이 둔다.

                  둘 다 sm:flex-1 로 반반이다(각 250px). 전에는 둘 다 내용
                  크기라 줄이 362px 에서 끝나 오른쪽 150px 가 비었고, 그래서 첫
                  버튼에만 flex-1 을 줬더니 375 / 125px 로 한쪽이 과하게 커졌다.
                  반반이어도 줄은 그대로 끝까지 차고, CTA 위계는 크기가 아니라
                  색이 맡는다 — 채운 빨강 vs 테두리만 있는 네이비.
                  640 미만은 flex-col 이라 이미 전폭이다.

                  위 간격이 32 가 아니라 28px(mt-7)인 이유는 줄 맞춤이다. 칸
                  바닥이 468, 버튼이 56.1px 이므로 28px 를 두면 표 바닥이
                  468 - 56.1 - 28 = 383.9 로 떨어져 큰 사진 바닥(384)과 0.1px
                  차이가 된다. 32px 면 379.9 로 4px 어긋난다. */}
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/contact/"
                  className="rounded bg-brand px-8 py-4 text-center text-[15px] font-semibold text-white transition-colors hover:bg-brand-dark sm:flex-1"
                >
                  {product.name} 견적 문의
                </Link>
                <Link
                  href="/products/"
                  className="rounded border border-navy/30 px-8 py-4 text-center text-[15px] font-semibold text-navy transition-colors hover:border-navy hover:bg-surface sm:flex-1"
                >
                  제품 목록
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* 특징 — 전에는 오른쪽 512px 칸에 갇힌 세로 목록이었다. 전폭으로 풀면
          한눈에 견준다. 왼쪽 2px 빨간 띠는 뺐다(분류 사이드바에서 걷어낸 것과
          같은 장식이고, 한 화면에 빨강이 여러 번 반복됐다).

          개수는 제품마다 다르다 — 2~4개다. products.ts 의 features 주석에
          기준을 적어 뒀다(사양 표에 같은 내용이 있으면 특징에 적지 않는다). */}
      {/* 제목만 가운데로 둔다. 참고한 안산FA 도 .section-title 이
          text-align:center 이고 항목은 왼쪽이다. align="center" 는 eyebrow 를
          알약 배지로도 바꾼다(Section 주석 참고). 사양·다른 제품 섹션은 왼쪽
          그대로다 — 한 섹션만 가운데면 그 섹션이 강조된다. */}
      <Section
        tone="surface"
        size="compact"
        eyebrow="FEATURES"
        title="제품 특징"
        align="center"
      >
        {/* 참고로 주신 ansanfa.com/sub03.html 의 "ANSANFA PRODUCT" 여섯 항목을
            재서 옮겼다.

              .row 1187x417 flex wrap   항목 6개가 3열 x 2행
              항목 396x149  배경.테두리.구분선 없음, 아래 여백 60px
              [0] div.icon      36x42 @x12 y0  체크 글리프 36px rgb(66,139,202)
              [1] h4.title     312x22 @x72 y0  18px/21.6px w700
              [2] p.description 312x48 @x72 y37 14px/24px w400 (2줄)

            거기서 가져온 것은 셋이다 — 마커가 번호가 아니라 체크라는 것,
            구분선이 없고 간격만으로 나눈다는 것, 아이콘과 글 사이를 넉넉히
            둔다는 것.

            전에는 번호 "01"~"04" 였다. 특징은 순서가 뜻을 갖지 않는다 —
            "이런 것을 합니다" 라 체크가 맞다.

            구분선을 걷었다. 2열에서 항목마다 border-b 를 주면 선이 gap-x-10
            에서 끊겨 ul 상단의 전폭 선과 길이가 어긋났는데, 그 문제도 같이
            사라진다. 대신 gap-y-8(32px)이 행을 나눈다(안산FA 는 60px 인데
            우리 글자가 작아 32px 로 맞췄다).

            아이콘은 20px 다. 안산FA 는 제목 18px 에 아이콘 36px(두 배)인데
            그 비율이면 34px 체크가 되어 레드가 너무 넓어진다(globals.css 토큰
            주석 — "레드는 면적을 좁게"). 20px 이면 제목의 1.2배이고 획이 얇아
            면적이 작다. 원형 배경은 두지 않는다 — 안산FA 에 없고, 선을 걷은
            자리에 또 도형을 넣으면 가벼움이 사라진다. mt-0.5 는 20px 아이콘과
            23.4px 제목 줄의 시각 중심을 맞추는 값이다.

            열은 둘이다. 안산FA 는 여섯 개라 3열이 딱 맞지만 우리는 제품마다
            2~4개여서 3열이면 네 개가 3+1 로 어긋난다. 2열이면 칸이 556px
            (1024 는 453px)라 본문이 한두 줄로 칸을 채운다.

            아이콘은 aria-hidden 이다. 목록이라는 사실은 ul/li 가 전달한다. */}
        <ul className="grid gap-y-8 lg:grid-cols-2 lg:gap-x-10">
          {product.features.map((f, i) => (
            <Reveal as="li" key={f.title} delay={i * 70}>
              <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-3.5">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 text-brand"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                <div>
                  <p className="text-[17px] font-bold leading-snug text-ink">
                    {f.title}
                  </p>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">
                    {f.body}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
      </Section>

      <Section size="compact" eyebrow="SPECIFICATIONS" title="제작 사양">
        {/* 표와 그 아래 안내 문단은 한 덩어리로 읽히므로 한 겹으로 묶는다. */}
        <Reveal>
          {/* 한 행에 두 쌍을 넣는다. 전에는 행마다 flex 였는데 dd 에 flex-1
              이 없어 dd 가 내용 크기만큼만 차지했다 — 1088px 표에서 dt 176 +
              dd 125px 를 쓰고 787px 가 빈 채, 값이 행마다 다른 곳(125~322px)
              에서 끝나고 구분선만 끝까지 그어졌다.

              42개 값을 전부 재니 가장 긴 것이 282px("경첩 · 잠금 구조 (부품
              보충 · 지그 점검 시 개방)")이고 라벨은 68px("거칠기 등급")가
              최대였다. 한 행에 두 쌍이 들어간다.

              앞 세 줄은 히어로 "주요 사양" 카드가 가져가므로 여기서는
              slice(3) 으로 뒤 세 줄만 쓴다. 세 쌍이라 한 열(두 칸)이다 —
              한때 여섯 줄을 두 쌍씩 놓아 네 칸으로 만들었는데, 세 쌍이 되면
              마지막 한 쌍이 빈 칸을 둘 남긴다. 표 높이는 어느 쪽이든 세 행
              168px 로 같다.

              라벨 칸 9rem(144px) — 가장 긴 라벨 68px("거칠기 등급")에 글상자
              104px 로 여유가 있다. 남는 값 21개의 최대 폭이 282px 라 dd 칸
              (1440 944px, 768 542px)에서 당연히 한 줄이다. 640 미만은 dt/dd
              세로 스택이다.

              격자선은 gap-px + bg-line 이다. 셀마다 border-b 를 주면 마지막
              행에서 바깥 테두리와 겹쳐 이중선이 되고, 그 "마지막 행" 이
              폭마다 달라져 끌 수가 없다.

              dt/dd 는 격자 직계여야 한다(접근성 검사 dlitem). 그래서 묶는
              div 대신 Fragment 를 쓴다. */}
          <dl className="grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-[9rem_minmax(0,1fr)]">
            {product.specs.slice(3).map((spec) => (
              <Fragment key={spec.label}>
                <dt className="bg-surface px-5 py-4 text-sm font-bold text-ink">
                  {spec.label}
                </dt>
                <dd className="bg-white px-5 py-4 text-sm leading-relaxed text-ink-soft">
                  {spec.value}
                </dd>
              </Fragment>
            ))}
          </dl>

          {/* 경쟁사(신창에프에이)는 표준 기종을 팔아 형식별 용량·전원·진동수·
            중량 표가 있다. 유신은 부품에 맞춰 만드는 회사라 그 표가 나올 수
            없다 — 숨기지 말고 여기서 말한다. 없는 수치를 지어 넣으면 고객이
            그대로 믿고 발주하는 값이 되므로 하지 않는다.

            뒷문장은 company.ts 의 process[0]("공급할 부품 샘플과 도면을 받아
            형상·재질·무게·요구 공급 속도를 확인합니다")을 근거로 쓴다.
            유신에서 기종별 수치를 받으면 이 문단을 지우고 위 표를 수치표로
            바꾼다(README '받아야 할 자료' 7번).

            박스로 묶었다. 전에는 표 아래 회색 글자가 그냥 떠 있어 표의
            일부인지 다음 이야기인지 안 읽혔다. 레드 강조선은 쓰지 않는다 —
            주의 경고가 아니라 "수치는 견적 때 산출한다" 는 안내다.

            ⚠️ 한 줄을 넘기지 말 것. 박스 글상자가 1280 이상 1020px,
            1024 877px, 768 636px 다(패딩 40 + 아이콘·간격 28 을 뺀 값).
            가장 좁은 768 에 들어가려면 636px 이 한계라 지금 문장이 그
            기준으로 깎여 있다. 640 이하(508px)에서는 어차피 두 줄이 된다 —
            거기서 한 줄로 넣으려면 뜻이 남지 않는다. */}
          <div className="mt-4 flex items-start gap-3 rounded-lg bg-surface px-5 py-4">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="mt-0.5 shrink-0 text-muted"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
            <p className="text-sm leading-relaxed text-muted">
              볼 직경·처리 수량 같은 수치는 부품과 속도에 따라 다릅니다. 샘플과
              도면을 주시면 산출해 회신드립니다.
            </p>
          </div>
        </Reveal>

        <h3 className="mt-12 text-lg font-bold text-ink">적용 분야</h3>
        {/* 분야가 부품군을 가리키는 제품(지금은 볼피더뿐)은 사진 카드로,
            "볼피더 구동부" 처럼 자리를 가리키는 나머지는 칩으로 그린다.
            데이터가 둘을 구분한다 — products.ts 의 applications 참고.
            한 제품 안에서 섞이면 그 파일 끝의 검사가 빌드를 멈춘다. */}
        {typeof product.applications[0] === "string" ? (
          <Reveal>
            {/* 칩에 레드 점을 붙인다. 위 히어로의 분류 배지가 이미
                rounded-full + border-line + bg-surface + bg-brand 점이라,
                같은 언어를 쓰면 한 페이지에서 칩이 한 가지 생김새로 읽힌다.
                히어로 "주요 특징" 은 체크, 여기는 점 — 마커가 달라 둘이
                섞이지 않는다. */}
            <ul className="mt-4 flex flex-wrap gap-2">
              {(product.applications as string[]).map((a) => (
                <li
                  key={a}
                  className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium text-ink-soft"
                >
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand"
                  />
                  {a}
                </li>
              ))}
            </ul>
          </Reveal>
        ) : (
          <ApplicationCases
            cases={product.applications as ApplicationCase[]}
          />
        )}
      </Section>

      {/* 목록 페이지와 똑같은 세로 카드다 — ProductCard 를 그대로 쓴다.
          가로 카드(352x98)와 전폭 한 줄 목록을 거쳐 여기로 돌아왔다: 사진이
          80px 썸네일이거나 아예 없으면 어느 제품인지 글자로만 알아야 했다.
          참고로 받은 신창에프에이 nsc-parts-feeder 의 "관련 제품" 도 사진
          있는 3열 카드(389x424, 사진 4:3)다.

          사진 칸은 4:3 이다. 한때 여기만 2:1 로 낮춰 카드를 작게 뒀는데,
          원본이 모두 4:3 이라 318px 칸에 212px 로 그려지고 좌우에 53px 씩 흰
          띠가 남았다. 띠를 없애는 방법은 칸을 원본 비율에 맞추는 것뿐이다 —
          object-cover 는 세로를 33% 자르고, 4:3 이 아닌 두 장(진동기 0.98,
          컨트롤러 1.06)은 45~51% 잘린다.

          크기는 간격이 잡는다. 이 페이지는 /products 와 달리 왼쪽 분류
          사이드바가 없어 격자가 Container 1088px 를 다 쓴다(목록 쪽은 848px 를
          셋으로 나눠 카드가 267px 다). 간격 64px 이면 카드가 320px 가 되어
          사진이 318x239 로 목록보다 20% 커지므로, xl 에서 144px 로 벌려 카드를
          266.7px 에 맞춘다 — 사진 265x199 로 목록 카드와 치수가 같아진다.

          간격이 세 단계인 이유는 tagline 이다. 일곱 tagline 을 14px/1.625 로
          1px 씩 재 보면 모두 두 줄인 글상자 폭이 213~307px 인데(좁은 쪽 한계는
          직진피더 37자, 넓은 쪽은 방음커버 32자), 폭마다 Container 가 달라
          간격을 하나로 두면 어느 한쪽이 그 창을 벗어난다.

            폭    열  Container  간격   카드  글상자
            640   2      560      24    268    219
            768   2      688      24    332    283
            1024  3      944      64    272    222
            1280  3     1088     144    267    217

          1024 에서 144px 를 쓰면 카드가 218px 로 줄어 글상자가 169px(세 줄)가
          되므로 lg 는 64px 그대로 두고 xl 에서만 벌린다. sm.md 에 64px 을 뒀을
          때는 640 글상자가 199px 로 떨어져 직진피더.진동기가 세 줄이었다.
          세로는 gap-y-8 로 따로 둔다 — sm.md 는 2열이라 카드 셋이면 2행이
          되는데 64px 은 너무 벌어진다.

          배경을 흰색으로 둔다(위 "제작 사양" 과 같다). /products 는 흰 카드를
          일부러 회색 판에 올리는데(그 파일 주석: 흰 바탕에 흰 카드면 테두리
          1px 말고는 경계가 없어 격자가 평평해 보였다), 거기는 일곱 장이 꽉 찬
          격자고 여기는 두세 장이라 테두리와 그림자만으로도 카드가 선다.

          섹션은 약 609 -> 648px 가 된다. */}
      <Section size="compact" eyebrow="OTHER PRODUCTS" title="다른 제품">
        <ul className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-16 xl:gap-x-36">
          {related.map((p, i) => (
            <Reveal as="li" key={p.slug} delay={i * 70}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </ul>
      </Section>

      <ContactCTA />
    </>
  );
}
