import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/components/Container";
import ContactCTA from "@/components/ContactCTA";
import PageHero from "@/components/PageHero";
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

  return {
    title: `${product.name} (${product.nameEn})`,
    description: product.summary,
    openGraph: {
      title: `${product.name} | 유신 F.A 시스템`,
      description: product.summary,
      images: [{ url: product.images[0].src }],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const related = products.filter((p) => p.slug !== product.slug).slice(0, 3);

  return (
    <>
      <PageHero
        eyebrow={product.category}
        title={product.name}
        lead={product.summary}
      />

      <div className="border-b border-line bg-surface">
        <Container>
          <nav aria-label="현재 위치" className="py-4 text-xs text-muted">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="hover:text-brand">
                  홈
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/products" className="hover:text-brand">
                  제품
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="font-medium text-ink-soft">{product.name}</li>
            </ol>
          </nav>
        </Container>
      </div>

      <div className="py-14 sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            {/* 이미지 — 설명이 길어 데스크톱에서는 따라오게 고정한다 */}
            <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
              {product.images.map((img, i) => (
                <div
                  key={img.src}
                  className="relative aspect-[4/3] overflow-hidden rounded-lg border border-line bg-surface"
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    priority={i === 0}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-contain p-4"
                  />
                </div>
              ))}
            </div>

            {/* 설명 */}
            <div>
              <p className="text-xs font-bold tracking-[0.15em] text-brand">
                {product.nameEn.toUpperCase()}
              </p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                {product.name}
              </h2>
              <p className="mt-5 text-base leading-[1.9] text-ink-soft">
                {product.lead}
              </p>

              <h3 className="mt-10 text-sm font-bold tracking-[0.15em] text-ink">
                특징
              </h3>
              <ul className="mt-4 space-y-4">
                {product.features.map((f) => (
                  <li
                    key={f.title}
                    className="border-l-2 border-brand/30 pl-4"
                  >
                    <p className="text-[15px] font-bold text-ink">{f.title}</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                      {f.body}
                    </p>
                  </li>
                ))}
              </ul>

              <h3 className="mt-10 text-sm font-bold tracking-[0.15em] text-ink">
                제작 사양
              </h3>
              <dl className="mt-4 overflow-hidden rounded-lg border border-line">
                {product.specs.map((spec) => (
                  <div
                    key={spec.label}
                    className="flex flex-col border-b border-line last:border-0 sm:flex-row"
                  >
                    <dt className="bg-surface px-5 py-3 text-sm font-bold text-ink sm:w-36 sm:shrink-0">
                      {spec.label}
                    </dt>
                    <dd className="px-5 py-3 text-sm leading-relaxed text-ink-soft">
                      {spec.value}
                    </dd>
                  </div>
                ))}
              </dl>

              <h3 className="mt-10 text-sm font-bold tracking-[0.15em] text-ink">
                적용 분야
              </h3>
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

              <Link
                href="/contact"
                className="mt-10 inline-block w-full rounded bg-brand px-8 py-4 text-center text-[15px] font-semibold text-white transition-colors hover:bg-brand-dark sm:w-auto"
              >
                {product.name} 견적 문의
              </Link>
            </div>
          </div>

          {/* 다른 제품 */}
          <div className="mt-20 border-t border-line pt-12">
            <h2 className="text-lg font-bold text-ink">다른 제품</h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-3">
              {related.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/products/${p.slug}`}
                    className="flex items-center gap-4 rounded-lg border border-line p-4 transition-colors hover:border-navy/30 hover:bg-surface"
                  >
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded bg-surface">
                      <Image
                        src={p.images[0].src}
                        alt=""
                        fill
                        sizes="64px"
                        className="object-contain p-1.5"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-muted">{p.category}</p>
                      <p className="truncate text-sm font-bold text-ink">
                        {p.name}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </div>

      <ContactCTA />
    </>
  );
}
