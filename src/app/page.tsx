import Image from "next/image";
import Link from "next/link";
import Container from "@/components/Container";
import ContactCTA from "@/components/ContactCTA";
import ProductCard from "@/components/ProductCard";
import Section from "@/components/Section";
import { process, strengths } from "@/data/company";
import ClientGrid from "@/components/ClientGrid";
import Reveal from "@/components/Reveal";
import ScrollCue from "@/components/ScrollCue";
import StatCounter from "@/components/StatCounter";
import { featuredClients, totalClients } from "@/data/clients";
import { feederDefinition, products } from "@/data/products";
import { site, yearsInBusiness } from "@/data/site";
import VideoEmbed from "@/components/VideoEmbed";
import { featuredVideos } from "@/data/videos";

/** count=false 인 값은 세어 올리지 않는다 — 연도가 굴러가면 어색하다. */
const STATS = [
  {
    value: 1992,
    count: false,
    unit: "년 설립",
    note: `${yearsInBusiness}년째 한 분야`,
  },
  {
    value: yearsInBusiness,
    count: true,
    unit: "년 제작 경력",
    note: "설계부터 튜닝까지",
  },
  { value: totalClients, count: true, unit: "개사", note: "주요 거래처" },
  { value: products.length, count: true, unit: "종 제품", note: "피더 전 라인업" },
];

export default function Home() {
  return (
    <>
      {/* 1. Hero — 헤더를 뺀 한 화면에 지표 줄까지 전부 들어가야 한다.
          화면이 낮아지면 패딩·글자·이미지가 clamp()로 같이 줄어든다. */}
      <section className="hero-screen relative flex flex-col overflow-hidden bg-navy-deep">
        {/* 배경 1 — 네이비 그라데이션 바닥 */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-navy-deep via-navy-deep to-navy"
        />
        {/* 배경 2 — 실제 피더가 도는 영상.

            유튜브 iframe 을 쓰지 않는다. 홈은 외부 요청이 0건이고(그러려고
            영상 페이지도 VideoEmbed 파사드를 둔다), iframe 을 배경에 박으면
            열기만 해도 유튜브로 요청이 나가고 LCP 도 나빠진다. 자체 호스팅 mp4 다.

            아래에 같은 장면 정지컷을 깔아 둔다 — 영상이 뜨기 전과 "움직임 줄이기"
            설정에서 그대로 보이게 하려는 것이다(globals.css 의 .hero-video 참고).

            opacity 는 바깥 한 겹에만 건다 — 두 겹에 걸면 어두워진다.
            drift(느린 확대)는 걸지 않는다 — 영상 자체가 움직여 겹치면 과하다. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.5]"
        >
          <Image
            src="/images/hero-poster.webp"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          {/* muted 가 없으면 자동재생이 막히고, playsInline 이 없으면 모바일에서
              전체화면으로 튄다. preload 는 metadata — 첫 화면 페인트를 안 막는다. */}
          <video
            className="hero-video absolute inset-0 h-full w-full object-cover"
            poster="/images/hero-poster.webp"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          >
            <source src="/videos/hero.mp4" type="video/mp4" />
          </video>
        </div>
        {/* 배경 3 — 글자가 읽히도록 덮는 네이비 오버레이 + 가장자리 비네트 */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-navy-deep via-navy-deep/75 to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,transparent_45%,rgba(6,38,92,0.72)_100%)]"
        />
        {/* 배경 4 — 3D 도면 뒤에 까는 어두운 자리.

            영상이 가장 잘 드러나는 지점이 하필 도면 자리다. 영상을 켠 화면과 끈
            화면의 픽셀 차이를 격자로 재 보면 도면 뒤가 나머지보다 28% 더 드러난다.
            볼 테두리의 큰 곡선과 도면의 원형 플레이트가 포개져 서로를 방해하므로
            도면 뒤만 눌러 준다. 영상은 비어 있는 아래쪽·가장자리에서 보인다.

            앞서 여기 있던 원형 글로우(-right-32)는 목적은 같았지만 중심이 화면
            밖이라 정작 도면 뒤를 덮지 못했다.

            왼쪽을 걷어내 영상을 보이게 하는 방향은 쓰지 않는다 — 거긴 글자 자리다.

            도면은 sm 미만에서 숨으므로(아래 rise-zoom 블록) 스크림도 sm 부터 건다. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden bg-[radial-gradient(ellipse_34%_46%_at_70%_44%,rgba(6,38,92,0.95)_0%,rgba(6,38,92,0.65)_55%,transparent_80%)] sm:block"
        />

        <Container className="relative flex flex-1 items-center py-[clamp(1.5rem,4vh,3.5rem)]">
          <div className="grid w-full items-center gap-[clamp(1.5rem,3.5vh,3.5rem)] lg:grid-cols-[1.1fr_1fr]">
            <div>
              <p
                className="rise text-[clamp(0.625rem,1.1vh,0.75rem)] font-bold tracking-[0.25em] text-brand-light"
                style={{ animationDelay: "60ms" }}
              >
                SINCE 1992 · FEEDING AUTOMATION SYSTEM
              </p>
              <h1
                className="rise mt-[clamp(0.75rem,2vh,1.25rem)] text-[clamp(1.6rem,4.4vh,3.4rem)] font-bold leading-[1.25] tracking-tight text-white"
                style={{ animationDelay: "140ms" }}
              >
                부품 자동정렬 공급기,
                <br />
                <span className="text-brand-light">설계부터 튜닝까지</span>{" "}
                {/* 좁은 칼럼에서 "직접 / 만듭니다"로 끊기지 않게 묶어 둔다 */}
                <span className="whitespace-nowrap">직접 만듭니다</span>
              </h1>
              <p
                className="rise mt-[clamp(0.75rem,2vh,1.5rem)] max-w-xl text-[clamp(0.875rem,1.9vh,1.125rem)] leading-relaxed text-white/75"
                style={{ animationDelay: "220ms" }}
              >
                볼피더·직진피더·호퍼피더를 {yearsInBusiness}년째 만들고
                있습니다. 부품 샘플을 보내 주시면 형상을 분석해 그 부품만을
                위한 피더를 설계합니다.
              </p>

              <div
                className="rise mt-[clamp(1.25rem,3vh,2.25rem)] flex flex-row gap-3"
                style={{ animationDelay: "300ms" }}
              >
                <Link
                  href="/products"
                  className="group inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-6 py-4 text-[15px] font-semibold text-white transition-colors hover:bg-brand-dark sm:px-8"
                >
                  제품 살펴보기
                  <ArrowRight />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-lg border border-white/45 px-6 py-4 text-[15px] font-semibold text-white transition-colors hover:border-white/70 hover:bg-white/10 sm:px-8"
                >
                  견적 문의하기
                </Link>
              </div>
            </div>

            {/* 폰에서는 문구·버튼·지표를 한 화면에 넣을 자리가 없어 도면을 감춘다.
                배경 질감은 그대로 남는다. */}
            <div
              className="rise-zoom hidden justify-center sm:flex"
              style={{ animationDelay: "380ms" }}
            >
              <Image
                src="/images/hero-unit.webp"
                alt="파츠피더 구동부(진동기) 3D 도면"
                width={659}
                height={672}
                priority
                className="h-auto max-h-[min(30svh,340px)] w-auto object-contain drop-shadow-2xl lg:max-h-[min(42svh,460px)]"
              />
            </div>
          </div>

          <ScrollCue />
        </Container>

        {/* 2. 지표 스트립 — 섹션 맨 아래에 붙어 항상 첫 화면 안에 보인다 */}
        <div className="relative border-t border-white/10 bg-black/25 backdrop-blur-[2px]">
          <Container>
            <dl className="grid grid-cols-2 divide-white/10 sm:grid-cols-4 sm:divide-x">
              {STATS.map((s, i) => (
                <div
                  key={s.unit}
                  className="rise px-1 py-[clamp(0.75rem,2.2vh,1.75rem)] sm:px-6 sm:text-center"
                  style={{ animationDelay: `${460 + i * 70}ms` }}
                >
                  <dd className="order-first">
                    <StatCounter
                      value={s.value}
                      count={s.count}
                      className="text-[clamp(1.375rem,3.2vh,2.25rem)] font-bold tabular-nums text-white"
                    />
                    <span className="ml-1 text-sm font-medium text-white/60">
                      {s.unit}
                    </span>
                  </dd>
                  <dt className="mt-1 text-[clamp(0.625rem,1.3vh,0.75rem)] text-white/45">
                    {s.note}
                  </dt>
                </div>
              ))}
            </dl>
          </Container>
        </div>
      </section>

      {/* 3. 피더란 / 회사 개요 요약 */}
      <Section eyebrow="WHAT IS THE FEEDER" title={feederDefinition.title}>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <Reveal className="relative aspect-[4/3] overflow-hidden rounded-lg border border-line bg-surface">
            <Image
              src="/images/products/bowl-feeder-01.webp"
              alt="구리 부품을 정렬해 배출하고 있는 볼피더"
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
          </Reveal>
          <Reveal delay={120}>
            <p className="text-base leading-relaxed text-ink-soft sm:text-lg">
              {feederDefinition.body}
            </p>
            <p className="mt-5 text-base leading-relaxed text-ink-soft sm:text-lg">
              유신 F.A 시스템은 이 피더를 {yearsInBusiness}년째 만들어 온
              회사입니다. 볼 형상 설계, 정렬 지그 가공, 진동 튜닝, 조립과 현장
              설치까지 한 공장 안에서 끝냅니다.
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
          </Reveal>
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
          {products.map((product, i) => (
            <Reveal key={product.slug} delay={i * 70}>
              <ProductCard product={product} />
            </Reveal>
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
            <Reveal key={s.title} delay={i * 80} className="bg-white p-7 sm:p-9">
              <span className="text-sm font-bold tabular-nums text-brand">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 text-lg font-bold text-ink">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                {s.body}
              </p>
            </Reveal>
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
          {process.map((p, i) => (
            <Reveal as="li" key={p.step} delay={i * 80} className="bg-navy-deep p-7 sm:p-8">
              <span className="text-3xl font-bold tabular-nums text-brand-light">
                {p.step}
              </span>
              <h3 className="mt-4 text-base font-bold text-white">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/65">
                {p.body}
              </p>
            </Reveal>
          ))}
        </ol>
      </Section>

      {/* 7. 제품 영상 — videos.ts가 비어 있으면 통째로 렌더하지 않는다.
             여기는 맛보기 두 편만 걸고 나머지는 /videos 에서 본다. */}
      {featuredVideos.length > 0 && (
        <Section
          tone="surface"
          eyebrow="VIDEO"
          title="제품 영상"
          lead="실제 현장에서 부품이 정렬되어 나오는 모습입니다."
        >
          <ul className="grid gap-6 sm:grid-cols-2 sm:gap-8">
            {featuredVideos.map((v) => (
              <li key={v.id}>
                <figure>
                  <VideoEmbed video={v} />
                  <figcaption className="mt-3 text-sm font-bold text-ink">
                    {v.title}
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
          <Link
            href="/videos"
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-navy underline underline-offset-4 hover:text-brand"
          >
            영상 전체 보기
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
      )}

      {/* 8. 주요 거래처 */}
      <Section
        eyebrow="CLIENTS"
        title="주요 거래처"
        lead={`전기·전자부품부터 제약, 화장품 용기까지 ${totalClients}개사에 납품해 왔습니다.`}
      >
        <Reveal>
          <ClientGrid names={featuredClients} />
        </Reveal>
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
            telephone: [site.tel, ...site.telExtra],
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

/** CTA 버튼용 화살표. ProductCard·NavPanel과 같은 모양으로 맞췄다. */
function ArrowRight() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="shrink-0 transition-transform group-hover:translate-x-1"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
