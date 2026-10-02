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
        {/* 네모 카드를 쓰지 않는다. 전에는 gap-px + bg-line 2열 격자라 선으로
            나뉜 네모 넷이었다. 참고한 ablelabsinc.com/notable96 에서 가져온
            것은 왼쪽 타일이 만드는 리듬뿐이고, 카드는 비웠다 — 남는 것은
            번호 타일과 가로 구분선이다.

            열 수가 폭마다 다르다. 768 에서 3열을 쓰면 제목 칸이 200px 로
            좁아져 긴 제목이 두 줄이 된다. 그래서 1024 부터만 3열이고, 제목
            칸은 18rem(288px) 이다 — 거기서 20개 제목이 모두 한 줄이고 가장
            긴 본문이 두 줄이다.

            items-baseline 이 없으면 안 된다. 기본값(stretch)이면 제목은 칸
            맨 위에 붙고 숫자는 타일 가운데 있어 1440에서 숫자 중앙 56.0px,
            제목 첫 줄 중앙 43.6px — 12.4px 어긋났다. baseline 은 숫자와 제목
            글자의 밑변을 맞추므로 폭과 본문 줄 수에 관계없이 2.4px 안쪽이다.
            items-center 는 쓸 수 없다 — 1440에서는 완벽하지만(0.1px) 640~1023
            에서 타일이 row-span-2 로 두 행을 걸치는 탓에 타일이 제목+본문
            블록 가운데로 내려가 본문 2줄 행에서 30.3px 어긋난다.

            타일은 36px 다. 48px 일 때는 타일이 행 높이를 정해 1440에서 한 행
            112.8px 인데 글자는 24.8px 뿐이었다. 36px + py-5/6 으로 한 행
            84.8px 이 된다. 32px 까지 줄이면 "01" 두 자에 여유가 없다.

            번호 타일은 흰색이다. 이 섹션이 tone="surface" 라 흰 타일이
            또렷하게 뜬다. 레드는 숫자 글자에만 쓴다(globals.css 의 토큰
            주석 — "레드는 면적을 좁게"). */}
        <ul className="border-t border-line">
          {product.features.map((f, i) => (
            <Reveal
              as="li"
              key={f.title}
              delay={i * 70}
              className="border-b border-line py-5 sm:py-6"
            >
              <div className="grid items-baseline gap-x-10 gap-y-3 sm:grid-cols-[auto_minmax(0,1fr)] lg:grid-cols-[auto_minmax(0,18rem)_minmax(0,1fr)]">
                {/* 순서는 ul/li 가 이미 전달한다. 눈으로만 읽는 번호다. */}
                <span
                  aria-hidden="true"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-white text-xs font-bold tabular-nums text-brand sm:row-span-2 lg:row-span-1"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-[17px] font-bold leading-snug text-ink">
                  {f.title}
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
