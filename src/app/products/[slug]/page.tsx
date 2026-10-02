import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import Container from "@/components/Container";
import ContactCTA from "@/components/ContactCTA";
import ProductCard from "@/components/ProductCard";
import ProductGallery from "@/components/ProductGallery";
import Section from "@/components/Section";
import { getProduct, products } from "@/data/products";

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

  const related = products.filter((p) => p.slug !== product.slug).slice(0, 3);

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

      {/* 특징 — 전에는 오른쪽 512px 칸에 갇힌 세로 목록이었다. 전폭 2열로
          풀면 네 개를 한눈에 견준다. 왼쪽 2px 빨간 띠는 뺐다(분류 사이드바에서
          걷어낸 것과 같은 장식이고, 한 화면에 빨강이 네 번 반복됐다). */}
      <Section tone="surface" size="compact" eyebrow="FEATURES" title="특징">
        <ul className="grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2">
          {product.features.map((f) => (
            <li key={f.title} className="bg-white p-6 sm:p-7">
              <p className="text-base font-bold text-ink">{f.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                {f.body}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <Section size="compact" eyebrow="SPECIFICATIONS" title="제작 사양">
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

        <h3 className="mt-12 text-lg font-bold text-ink">적용 분야</h3>
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
      </Section>

      {/* 제품 목록과 같은 카드를 쓴다. 전에는 64px 썸네일 한 줄이라 목록
          페이지와 생김새가 전혀 달랐다. */}
      <Section tone="surface" size="compact" eyebrow="OTHER PRODUCTS" title="다른 제품">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </Section>

      <ContactCTA />
    </>
  );
}
