import type { Metadata } from "next";
import Link from "next/link";
import { Fragment } from "react";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import Container from "@/components/Container";
import ContactCTA from "@/components/ContactCTA";
import ProductGallery from "@/components/ProductGallery";
import ProductRowCard from "@/components/ProductRowCard";
import Reveal from "@/components/Reveal";
import Section from "@/components/Section";
import { getProduct, products, type Product } from "@/data/products";

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
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-16">
            <ProductGallery images={product.images} />

            <div>
              {/* 분류 배지. 점 하나로 레드를 아주 좁게만 쓴다. */}
              <p className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5 text-xs font-bold tracking-[0.1em] text-ink-soft">
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

              {/* 주요 사양 — specs 앞 세 줄이다. 아래 사양 표는 slice(3) 로
                  뒤 세 줄만 쓴다. 같은 줄이 두 번 나오지 않는다.

                  전에는 이 자리에 features.title 을 넣었는데, 아래 FEATURES
                  섹션의 제목 네 개와 글자까지 100% 같았다. 히어로는 "이 제품이
                  무엇인가"(주요 내용)를, 아래는 "왜 좋은가"(특징)를 맡아야
                  하므로 축을 사양으로 바꿨다.

                  그 전에는 lead 문단(3줄)이었다. lead 는 데이터에 남아
                  generateMetadata 의 검색 설명으로 쓰인다 — 화면에서만 빠졌다.

                  참고로 받은 신창에프에이 LSP 호퍼피더의 히어로 박스를 쟀다 —
                  568x208, 연한 회색 바탕, radius 12, padding 24, 라벨 12px/700
                  tracking 2.4px. 그 짜임을 우리 토큰으로 옮겼다.

                  값은 어느 폭에서나 한 줄이다. 13px 로 재면 앞 세 줄 21개의
                  가장 긴 것이 246px("스테인리스, 알루미늄 (부품 특성에 따라
                  선정)")이고, 값 칸이 가장 좁아지는 1024(308px)에도 들어간다.
                  라벨은 가장 긴 것이 63px("거칠기 등급")라 5rem(80px)에 든다.

                  dt/dd 는 dl 직계여야 한다(접근성 검사 dlitem). 묶는 div 대신
                  Fragment 를 쓴다 — 아래 사양 표와 같은 이유다.

                  가로선을 둬 표로 읽히게 했다. 전에는 라벨과 값이 같은 13px
                  이고 굵기만 달라 위계가 약했고, 행 간격이 8px 뿐이라 세 사양이
                  한 덩어리로 뭉쳤다. 선은 라벨 아래 하나와 사양 사이 둘, 모두
                  셋이다 — 마지막 행 아래는 카드 테두리가 닫으므로 두지 않는다.
                  세로선도 두지 않는다: 512px 카드에 격자선을 치면 답답하다.

                  라벨을 12px muted 로 내리고 값을 w500 으로 올려 값이 주인공이
                  되게 했다. 라벨이 위 "주요 사양" 과 같은 계열(작고 자간 있는
                  글자)이 되어 카드 안 언어가 통일된다.

                  높이도 맞아떨어진다. 144 -> 187px 가 되면서 1280 이상에서
                  오른쪽 칸이 갤러리(468px)와 1px 차이가 된다 — 전에는 44px
                  모자라 아래가 비었다. */}
              <div className="mt-6 rounded-lg border border-line bg-surface px-5 py-4">
                <p className="text-xs font-bold tracking-[0.2em] text-muted">
                  주요 사양
                </p>
                <dl className="mt-1 grid grid-cols-[5rem_minmax(0,1fr)] gap-x-4">
                  {product.specs.slice(0, 3).map((spec) => (
                    <Fragment key={spec.label}>
                      <dt className="border-t border-line py-3 text-xs font-bold tracking-wide text-muted">
                        {spec.label}
                      </dt>
                      <dd className="border-t border-line py-3 text-[13px] font-medium text-ink">
                        {spec.value}
                      </dd>
                    </Fragment>
                  ))}
                </dl>
              </div>

              {/* 버튼 둘. 보던 제품이 아니면 목록으로 돌아갈 길을 같이 둔다. */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/contact/"
                  className="rounded bg-brand px-8 py-4 text-center text-[15px] font-semibold text-white transition-colors hover:bg-brand-dark"
                >
                  {product.name} 견적 문의
                </Link>
                <Link
                  href="/products/"
                  className="rounded border border-navy/30 px-8 py-4 text-center text-[15px] font-semibold text-navy transition-colors hover:border-navy hover:bg-surface"
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
        <Reveal>
          {/* 칩에 레드 점을 붙인다. 위 히어로의 분류 배지가 이미
              rounded-full + border-line + bg-surface + bg-brand 점이라,
              같은 언어를 쓰면 한 페이지에서 칩이 한 가지 생김새로 읽힌다.
              히어로 "주요 특징" 은 체크, 여기는 점 — 마커가 달라 둘이
              섞이지 않는다. */}
          <ul className="mt-4 flex flex-wrap gap-2">
            {product.applications.map((a) => (
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
      </Section>

      {/* 전폭 한 줄 목록이다(ProductRowCard). 목록 페이지와 같은 세로 카드
          (347x437px)에서 가로 카드(352x98px)를 거쳐 여기까지 왔다. 가로 카드는
          내용이 180px 에서 끝나 오른쪽 172px 가 비었고, 세 열이라 그 빈 띠가
          세 번 반복됐다. 전폭 한 줄이면 요약 문구가 가로를 채우고 화살표가
          오른쪽 끝을 닫는다.

          테두리를 ul 하나에만 두고 divide-y 로 행을 나눈다. 행마다 테두리 +
          간격 12px 로 두면 세 장이 336px 인데 한 덩어리면 254px 다. 세로로
          쌓이므로 섹션은 359 -> 515px 로 늘어난다 — 오른쪽 여백을 없애는
          대가다. */}
      <Section
        tone="surface"
        size="compact"
        eyebrow="OTHER PRODUCTS"
        title="다른 제품"
      >
        <ul className="divide-y divide-line overflow-hidden rounded-lg border border-line bg-white">
          {related.map((p, i) => (
            <Reveal as="li" key={p.slug} delay={i * 70}>
              <ProductRowCard product={p} />
            </Reveal>
          ))}
        </ul>
      </Section>

      <ContactCTA />
    </>
  );
}
