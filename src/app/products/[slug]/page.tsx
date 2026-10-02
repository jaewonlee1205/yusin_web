import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import Container from "@/components/Container";
import ContactCTA from "@/components/ContactCTA";
import ProductCard from "@/components/ProductCard";
import ProductGallery from "@/components/ProductGallery";
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
              <p className="mt-4 text-base leading-[1.9] text-ink-soft">
                {product.lead}
              </p>

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
      <Section tone="surface" size="compact" eyebrow="FEATURES" title="특징">
        {/* 번호를 제목과 같은 줄 안에 넣는다. 이 하나로 세 가지가 풀린다.

            1. 어긋남이 0 이다. 전에는 번호를 36x36 타일에 담아 자기 열에
               뒀는데, 타일 가운데 있는 숫자와 칸 맨 위에 붙는 제목이 1440에서
               12.4px 어긋났다. items-baseline 으로 2.4px 까지 줄였지만 0 은
               못 됐다 — baseline 은 글자 밑변을 맞추는 것이라 숫자(12px)와
               제목(17px)의 크기가 다르면 시각적 중앙이 남는다. 지금은 둘이
               한 줄 박스 안에 있고 글자 크기도 같아(둘 다 17px bold) 어긋날
               방법이 없다. 다른 것은 색뿐이다.

            2. 한 행이 절반이 된다. 타일 36px 이 행 높이를 정했는데 글자는
               24.4px 뿐이었다 — 타일 36 + py-5/6 = 85px. 이제 글자가 높이를
               정해 24.4 + py-4 = 56.4px 다. 참고로 주신 신창에프에이 MLCC
               호퍼피더는 한 항목이 26px 인데, 거기는 제목도 번호도 없이 한 줄
               문장만 나열한다. 셋을 담고 56px 이면 그만큼이 정보 차이다.

            3. 레드가 좁아진다. "01" 두 자가 17px 에서 22px 폭이라 36px 타일
               보다 좁다(globals.css 토큰 주석 — "레드는 면적을 좁게").

            flex gap-3 으로 묶는다. 제목이 두 줄이 되어도 둘째 줄이 번호 아래로
            들여써진다. 재 보니 "01 + 제목" 이 가장 긴 것이 185px 라 제목 칸
            288px 은 물론 320px 글상자(264.8px)에서도 20개 전부 한 줄이다.

            열은 둘이다. 번호 열이 없어졌으므로 1024 부터 [18rem_1fr] 2열이고
            그 아래는 제목/본문 세로 스택이다. 1024 에서 본문 칸이 541 ->
            617px 로 넓어져 20개 본문이 전부 한 줄이 된다(전에는 여섯이 두
            줄이었다). lg:items-baseline 은 남긴다 — 17px 제목과 15px 본문의
            첫 줄 밑변을 맞춘다. */}
        <ul className="border-t border-line">
          {product.features.map((f, i) => (
            <Reveal
              as="li"
              key={f.title}
              delay={i * 70}
              className="border-b border-line py-4"
            >
              <div className="grid gap-y-2 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] lg:items-baseline lg:gap-x-10">
                <p className="flex gap-3 text-[17px] font-bold leading-snug text-ink">
                  {/* 순서는 ul/li 가 이미 전달한다. 눈으로만 읽는 번호다.
                      tabular-nums 라 01~04 의 폭이 같아 제목이 어느 행에서나
                      같은 x 에서 시작한다. */}
                  <span
                    aria-hidden="true"
                    className="shrink-0 tabular-nums text-brand"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{f.title}</span>
                </p>
                <p className="text-[15px] leading-relaxed text-ink-soft">
                  {f.body}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>
      </Section>

      <Section size="compact" eyebrow="SPECIFICATIONS" title="제작 사양">
        {/* 표와 그 아래 안내 문단은 한 덩어리로 읽히므로 한 겹으로 묶는다. */}
        <Reveal>
          <dl className="overflow-hidden rounded-lg border border-line">
            {product.specs.map((spec) => (
              <div
                key={spec.label}
                className="flex flex-col border-b border-line last:border-0 sm:flex-row"
              >
                <dt className="bg-surface px-5 py-4 text-sm font-bold text-ink sm:w-44 sm:shrink-0">
                  {spec.label}
                </dt>
                <dd className="px-5 py-4 text-sm leading-relaxed text-ink-soft">
                  {spec.value}
                </dd>
              </div>
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

            ⚠️ 한 줄을 넘기지 말 것. 칸이 1280 이상 1088px, 1024 945px,
            768 704px 인데 14px 글자로 한 줄에 들어가려면 64자쯤이 한계다.
            640 이하(576px)에서는 어차피 두 줄이 된다 — 거기서 한 줄로
            넣으려면 39자까지 깎아야 해 뜻이 남지 않는다. */}
          <p className="mt-4 text-sm leading-relaxed text-muted">
            볼 직경·처리 수량 같은 수치는 부품과 요구 속도에 따라 다릅니다.
            샘플과 도면을 보내 주시면 산출해 회신드립니다.
          </p>
        </Reveal>

        <h3 className="mt-12 text-lg font-bold text-ink">적용 분야</h3>
        <Reveal>
          <ul className="mt-4 flex flex-wrap gap-2">
            {product.applications.map((a) => (
              <li
                key={a}
                className="rounded-full border border-line bg-surface px-4 py-2 text-sm text-ink-soft"
              >
                {a}
              </li>
            ))}
          </ul>
        </Reveal>
      </Section>

      {/* 제품 목록과 같은 카드를 쓴다. 전에는 64px 썸네일 한 줄이라 목록
          페이지와 생김새가 전혀 달랐다. */}
      <Section
        tone="surface"
        size="compact"
        eyebrow="OTHER PRODUCTS"
        title="다른 제품"
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((p, i) => (
            <Reveal key={p.slug} delay={i * 70}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </Section>

      <ContactCTA />
    </>
  );
}
