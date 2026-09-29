import Image from "next/image";
import Link from "next/link";
import Container from "@/components/Container";
import ContactCTA from "@/components/ContactCTA";
import ProductCard from "@/components/ProductCard";
import Section from "@/components/Section";
import { process, strengths } from "@/data/company";
import ClientGrid from "@/components/ClientGrid";
import { featuredClients, totalClients } from "@/data/clients";
import { feederDefinition, products } from "@/data/products";
import { site } from "@/data/site";
import { videos } from "@/data/videos";

const YEARS = new Date().getFullYear() - 1992;

const STATS = [
  { value: "1992", unit: "년 설립", note: "30년 넘게 한 분야" },
  { value: `${YEARS}`, unit: "년 제작 경력", note: "설계부터 튜닝까지" },
  { value: String(totalClients), unit: "개사", note: "주요 거래처" },
  { value: String(products.length), unit: "종 제품", note: "피더 전 라인업" },
];

export default function Home() {
  return (
    <>
      {/* 1. Hero */}
      <section className="relative overflow-hidden bg-navy-deep">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[url('/images/blueprint-bg.webp')] bg-cover bg-center opacity-[0.07]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full bg-navy/50 blur-3xl"
        />
        <Container className="relative">
          <div className="grid items-center gap-10 py-16 sm:py-24 lg:grid-cols-[1.1fr_1fr] lg:gap-14 lg:py-28">
            <div>
              <p className="text-xs font-bold tracking-[0.25em] text-brand-light">
                SINCE 1992 · FEEDING AUTOMATION SYSTEM
              </p>
              <h1 className="mt-5 text-3xl font-bold leading-[1.25] tracking-tight text-white sm:text-5xl lg:text-[3.4rem]">
                부품 자동정렬 공급기,
                <br />
                <span className="text-brand-light">설계부터 튜닝까지</span> 직접
                만듭니다
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
                유신 F.A 시스템은 1992년부터 볼피더·직진피더·호퍼피더를 제작해
                왔습니다. 공급할 부품을 보내 주시면 형상을 분석해 그 부품만을
                위한 피더를 설계합니다.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/products"
                  className="rounded bg-brand px-7 py-3.5 text-center text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
                >
                  제품 살펴보기
                </Link>
                <Link
                  href="/contact"
                  className="rounded border border-white/30 px-7 py-3.5 text-center text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  견적 문의하기
                </Link>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              <Image
                src="/images/hero-unit.webp"
                alt="파츠피더 구동부(진동기) 3D 도면"
                width={659}
                height={672}
                priority
                className="h-auto w-full drop-shadow-2xl"
              />
            </div>
          </div>
        </Container>

        {/* 2. 지표 스트립 */}
        <div className="relative border-t border-white/10 bg-black/20">
          <Container>
            <dl className="grid grid-cols-2 divide-white/10 sm:grid-cols-4 sm:divide-x">
              {STATS.map((s) => (
                <div key={s.unit} className="px-1 py-7 sm:px-6 sm:text-center">
                  <dt className="sr-only">{s.note}</dt>
                  <dd>
                    <span className="text-3xl font-bold tabular-nums text-white sm:text-4xl">
                      {s.value}
                    </span>
                    <span className="ml-1 text-sm font-medium text-white/60">
                      {s.unit}
                    </span>
                    <span className="mt-1.5 block text-xs text-white/45">
                      {s.note}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </Container>
        </div>
      </section>

      {/* 3. 피더란 / 회사 개요 요약 */}
      <Section eyebrow="WHAT IS THE FEEDER" title={feederDefinition.title}>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-line bg-surface">
            <Image
              src="/images/products/bowl-feeder-01.webp"
              alt="구리 부품을 정렬해 배출하고 있는 볼피더"
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-base leading-relaxed text-ink-soft sm:text-lg">
              {feederDefinition.body}
            </p>
            <p className="mt-5 text-base leading-relaxed text-ink-soft sm:text-lg">
              유신 F.A 시스템은 이 피더를 30년 넘게 만들어 온 회사입니다. 볼
              형상 설계, 정렬 지그 가공, 진동 튜닝, 조립과 현장 설치까지 한
              공장 안에서 끝냅니다.
            </p>
            <Link
              href="/company"
              className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-navy underline underline-offset-4 hover:text-brand"
            >
              회사소개 자세히 보기
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </Section>

      {/* 4. 제품 라인업 */}
      <Section
        tone="surface"
        eyebrow="PRODUCTS"
        title="제품 라인업"
        lead="피더 본체부터 이송·보충·제어·방음·표면처리까지, 라인 구성에 필요한 요소를 모두 직접 제작합니다."
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </Section>

      {/* 5. 강점 */}
      <Section
        eyebrow="WHY YUSIN"
        title="유신의 강점"
        lead="피더는 카탈로그에서 고르는 물건이 아니라 부품에 맞춰 만드는 물건입니다. 그래서 만드는 사람의 손이 남습니다."
      >
        <div className="grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2">
          {strengths.map((s, i) => (
            <div key={s.title} className="bg-white p-7 sm:p-9">
              <span className="text-sm font-bold tabular-nums text-brand">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 text-lg font-bold text-ink">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* 6. 제작 프로세스 */}
      <Section
        tone="navy"
        eyebrow="PROCESS"
        title="문의부터 납품까지"
        lead="부품 샘플 한 점에서 시작합니다. 아래 네 단계를 거쳐 현장에서 도는 피더가 됩니다."
      >
        <ol className="grid gap-px overflow-hidden rounded-lg bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {process.map((p) => (
            <li key={p.step} className="bg-navy-deep p-7 sm:p-8">
              <span className="text-3xl font-bold tabular-nums text-brand-light">
                {p.step}
              </span>
              <h3 className="mt-4 text-base font-bold text-white">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/65">
                {p.body}
              </p>
            </li>
          ))}
        </ol>
      </Section>

      {/* 7. 제품 영상 — videos.ts가 비어 있으면 통째로 렌더하지 않는다 */}
      {videos.length > 0 && (
        <Section
          tone="surface"
          eyebrow="VIDEO"
          title="제품 영상"
          lead="실제 현장에서 부품이 정렬되어 나오는 모습입니다."
        >
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((v) => (
              <figure key={v.id}>
                <div className="relative aspect-video overflow-hidden rounded-lg border border-line bg-black">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${v.id}`}
                    title={v.title}
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                    className="absolute inset-0 h-full w-full"
                  />
                </div>
                <figcaption className="mt-3 text-sm font-medium text-ink-soft">
                  {v.title}
                </figcaption>
              </figure>
            ))}
          </div>
        </Section>
      )}

      {/* 8. 주요 거래처 */}
      <Section
        eyebrow="CLIENTS"
        title="주요 거래처"
        lead={`전기·전자부품부터 제약, 화장품 용기까지 ${totalClients}개사에 납품해 왔습니다.`}
      >
        <ClientGrid names={featuredClients} />
        <Link
          href="/clients"
          className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-navy underline underline-offset-4 hover:text-brand"
        >
          거래처 전체 보기
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </Link>
      </Section>

      {/* 9. 문의 CTA */}
      <ContactCTA />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: site.name,
            alternateName: site.nameEn,
            url: site.url,
            logo: `${site.url}/images/logo.png`,
            foundingDate: site.founded,
            description: site.description,
            telephone: site.tel,
            faxNumber: site.fax,
            email: site.email,
            address: {
              "@type": "PostalAddress",
              addressCountry: "KR",
              addressRegion: "경기도",
              addressLocality: "시흥시",
              streetAddress: site.address.road,
              postalCode: site.address.postalCode,
            },
            founder: { "@type": "Person", name: site.ceo },
            makesOffer: products.map((p) => ({
              "@type": "Offer",
              itemOffered: { "@type": "Product", name: p.name },
            })),
          }),
        }}
      />
    </>
  );
}
