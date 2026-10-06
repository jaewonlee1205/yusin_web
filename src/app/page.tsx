import Image from "next/image";
import Link from "next/link";
import Container from "@/components/Container";
import ContactCTA from "@/components/ContactCTA";
import ProductCard from "@/components/ProductCard";
import Section from "@/components/Section";
import { aboutPoints, process } from "@/data/company";
import ClientGrid from "@/components/ClientGrid";
import Reveal from "@/components/Reveal";
import ScrollCue from "@/components/ScrollCue";
import StatCounter from "@/components/StatCounter";
import { featuredClients, totalClients } from "@/data/clients";
import { products } from "@/data/products";
import { site, yearsInBusiness } from "@/data/site";
import VideoCard from "@/components/VideoCard";
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

/* "자세히 보기 / 전체 보기" 버튼. 오시는 길의 지도앱 버튼, 영상자료의
   "영상 더 보기" 와 같은 모양이다. */
const BTN =
  "group inline-flex items-center gap-2 rounded-xl border border-line bg-white px-5 py-3.5 text-sm font-semibold text-ink transition-colors hover:border-brand/40 hover:text-brand";

export default function Home() {
  return (
    <>
      {/* 1. Hero — 헤더를 뺀 한 화면에 지표 줄까지 전부 들어가야 한다.
          화면이 낮아지면 패딩·글자·이미지가 clamp()로 같이 줄어든다. */}
      <section className="hero-screen relative flex flex-col overflow-hidden bg-navy-deep">
        {/* 배경 2 — 실제 피더가 도는 영상.

            유튜브 iframe 을 쓰지 않는다. 홈은 외부 요청이 0건이고(그러려고
            영상 페이지도 VideoEmbed 파사드를 둔다), iframe 을 배경에 박으면
            열기만 해도 유튜브로 요청이 나가고 LCP 도 나빠진다. 자체 호스팅 mp4 다.

            아래에 같은 장면 정지컷을 깔아 둔다 — 영상이 뜨기 전과 "움직임 줄이기"
            설정에서 그대로 보이게 하려는 것이다(globals.css 의 .hero-video 참고).

            opacity 는 바깥 한 겹에만 건다 — 두 겹에 걸면 어두워진다.
            drift(느린 확대)는 걸지 않는다 — 영상 자체가 움직여 겹치면 과하다.

            0.5 였다가 0.3 으로 내렸다. 히어로의 겹을 다섯에서 둘로 줄이면서
            가장자리 비네트와 3D 도면 뒤를 눌러 주던 겹이 없어졌는데, 영상에는
            밝은 구간이 있어 그 프레임에서 도면과 글자가 흐려졌다. 스크림을
            다시 얹는 대신 영상 자체를 한 단계 낮춘다 — 겹은 둘로 남고 배경이
            조용해진다. 영상은 여전히 보인다. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.3]"
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
        {/* 배경 3 — 글자가 읽히도록 덮는 네이비 오버레이.

            ⚠️ 이 한 겹이 글자 가독성을 혼자 맡는다. 지우면 영상 위에서 흰
               글자가 읽히지 않는다.

            한때 히어로에 겹이 다섯이었다 — 바닥 그라디언트, 영상, 이 오버레이,
            가장자리 비네트, 3D 도면 뒤를 눌러 주는 자리. 하위 페이지 배너는
            장식을 모두 걷어 바탕 한 장으로 세웠는데 홈만 다섯이라, 영상(제품이
            도는 모습이니 내용이다)과 이 오버레이만 남겼다. 바닥 그라디언트는
            section 의 bg-navy-deep 과 거의 같은 색을 한 번 더 까는 것이었고,
            비네트와 도면 뒤 자리는 도면이 흰 금속이라 어두운 영상 위에서 그
            자체로 구분돼 없어도 읽힌다. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-navy-deep via-navy-deep/75 to-transparent"
        />

        <Container className="relative flex flex-1 items-center py-[clamp(1.5rem,4vh,3.5rem)]">
          <div className="grid w-full items-center gap-[clamp(1.5rem,3.5vh,3.5rem)] lg:grid-cols-[1.1fr_1fr]">
            <div>
              {/* 로고의 F.A 가 무엇의 약자인지 풀어 주는 자리다.
                  로고에는 "유신 F.A SYSTEM" 만 크게 보이고 그 아래 작은
                  영문은 눈에 잘 안 들어온다.

                  전에는 "SINCE 1992 · FEEDING AUTOMATION SYSTEM" 이었다.
                  SINCE 1992 를 뺀 것은 같은 화면에서 세 겹으로 겹쳤기
                  때문이다 — 지표 띠의 "1992년 설립", 본문의 "34년째",
                  지표의 "34년 제작 경력". 덤으로 그 긴 문구(313px)가
                  320·360 에서 두 줄로 깨지던 것도 없어졌다(이건 216px 라
                  320 에서도 한 줄이다). */}
              <p
                className="rise text-[clamp(0.625rem,1.1vh,0.75rem)] font-bold tracking-[0.25em] text-brand-light"
                style={{ animationDelay: "60ms" }}
              >
                {site.tagline}
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
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-4 text-[15px] font-semibold text-white transition-colors hover:bg-brand-dark sm:px-8"
                >
                  제품 살펴보기
                  <ArrowRight />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-xl border border-white/45 px-6 py-4 text-[15px] font-semibold text-white transition-colors hover:border-white/70 hover:bg-white/10 sm:px-8"
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
      {/* 회사를 말하는 자리다.

          한동안 여기가 "피더란 무엇인가" 였다(제목 "부품 자동정렬 공급기",
          박스 셋이 피더가 하는 일). 그런데 홈에서 회사를 말하는 자리가 히어로
          한 줄뿐이라, 이 자리를 회사 쪽으로 돌렸다.

          ⚠️ 히어로와 겹치지 않게 각도를 잡는다. 히어로가 이미 "설계부터
             튜닝까지 직접 만듭니다 / 34년째 만들고 있습니다" 를 말하므로,
             여기서는 같은 주장을 되풀이하지 않고 그것이 가능한 까닭(부서.
             설비.쌓인 사례)을 댄다. 제목도 박스 셋을 묶는 말이다.

          제목 다음이 바로 영상이다. 한동안 정의 한 문장이 사이에 있었는데
          박스 셋이 같은 말을 풀어 쓰고 있어 걷었다.

          lg:items-start — 윗변을 맞춘다.

          한때 items-center 였다. 박스가 셋이던 때는 오른쪽 덩어리가 235px 로
          영상(274px)보다 짧아, 가운데로 맞추면 두 덩어리의 세로 중심이 포개져
          자연스러웠다. 박스가 넷이 되면서 오른쪽이 291px 로 길어져 전제가
          뒤집혔다 — 영상이 가운데로 내려가면서 첫 박스가 영상보다 8px 위에
          떴다.

          지금은 윗변이 맞고 아래만 영상이 17px 먼저 끝난다. 시작점이 어긋나는
          것보다 끝점이 어긋나는 쪽이 훨씬 덜 보인다. 1024 미만은 1열이라 뜻이
          없으므로 lg 부터다. */}
      <Section eyebrow="ABOUT US" title="피더를 만드는 데 필요한 것">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start lg:gap-16">
          {/* 정지 사진이던 자리다. 피더가 무엇인지는 "부품이 돌다가 한 줄로
              서서 나간다" 는 움직임 자체라, 멈춘 사진으로는 절반만 전해졌다.

              히어로가 쓰는 영상을 그대로 건다. 볼피더가 커넥터 부품을 정렬해
              트랙으로 내보내는 10초짜리인데, 히어로에서는 opacity 0.3 에
              네이비 오버레이까지 덮여 거의 안 보인다 — 같은 파일이어도 여기서
              밝게 돌면 다른 영상처럼 읽히고, 이미 받는 파일이라 전송량도
              늘지 않는다.

              칸은 16/9 다 — 영상 원본과 같은 비율이라 아무 데도 잘리지
              않는다. 한때 사진 시절의 4/3 에 lg:h-full(오른쪽 칸 높이를 따라감)
              을 걸어 뒀는데, 정의 문장이 리드로 올라가면서 오른쪽이 짧아져
              2.07:1 까지 납작해졌다. 16/9 로 고정하면 영상이 274px 로 서고,
              grid 의 stretch 가 오른쪽 칸을 거기 맞춰 두 칸 높이도 그대로
              일치한다.

              ⚠️ Image 가 아래 깔려 있는 것은 장식이 아니다. globals.css 의
                 prefers-reduced-motion 블록이 .hero-video 를 display:none 으로
                 숨기므로, 움직임을 끈 사람에게는 이 정지컷이 보인다. 영상에서
                 뽑은 그림이라 장면이 어긋나지 않는다. 지우면 그 사람에게 빈
                 칸만 남는다. */}
          <Reveal className="relative aspect-video overflow-hidden rounded-2xl bg-surface">
            <Image
              src="/images/hero-poster.webp"
              alt="커넥터 부품을 정렬해 트랙으로 내보내는 볼피더"
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
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
          </Reveal>
          <Reveal delay={120}>
            {/* 회사의 됨됨이 셋 — 부서.설비.쌓인 사례. 제목("피더를 만드는
                데 필요한 것")이 묶는 말이고 이 셋이 그 내용이다.

                bg-surface + 레드 점은 제품 상세의 사양 박스.적용 분야 칩과
                같은 꼴이다 — 사이트에 이미 있는 언어라 새 모양을 더하지
                않는다. 섹션이 흰 바탕이라 흰 카드는 묻히고, 회색 박스가
                또렷하다. */}
            <ul className="space-y-2">
              {aboutPoints.map((point) => (
                <li
                  key={point.label}
                  className="flex items-center gap-3 rounded-xl bg-surface px-4 py-3.5"
                >
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand"
                  />
                  <p className="text-sm leading-snug text-ink-soft">
                    <b className="font-bold text-ink">{point.label}</b>
                    &nbsp;&nbsp;{point.body}
                  </p>
                </li>
              ))}
            </ul>
            {/* 밑줄 링크였다. 오시는 길의 지도앱 버튼.영상자료의 "영상 더 보기"
                와 같은 모양으로 맞춘다 — 사이트에 이미 있는 언어라 새 모양을
                더하지 않는다. */}
            <Link href="/company" className={`mt-7 ${BTN}`}>
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
                className="shrink-0 transition-transform group-hover:translate-x-1"
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
        action={
          /* VIDEO.CLIENTS.PROCESS 와 같은 자리.같은 꼴이다. */
          <Link href="/products" className={BTN}>
            제품 전체 보기
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
              className="shrink-0 transition-transform group-hover:translate-x-1"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        }
      >
        {/* 셋만 건다. 일곱 개를 다 늘어놓으면 3+3+1 로 끊겨 마지막 줄에 한
            칸만 남고, 홈에서 제품을 "훑어보는" 자리가 제품 목록 페이지와
            같아진다. 앞 셋은 배열 순서 그대로다 — 볼피더가 본체, 직진피더가
            이송, 진동기가 구동부로 피더 한 벌의 뼈대다. */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.slice(0, 3).map((product, i) => (
            <Reveal key={product.slug} delay={i * 70}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </Section>

      {/* 5. 제작 프로세스 */}
      <Section
        eyebrow="PROCESS"
        title="문의부터 납품까지"
        action={
          /* 제작 과정을 읽은 다음이 문의로 가기 가장 자연스러운 자리다.
             VIDEO.CLIENTS 섹션의 "전체 보기" 와 같은 꼴이다.

             글자가 "견적 문의하기" 가 아닌 것은 히어로 버튼이 이미 그 말을
             쓰고 있어서다. 한 페이지에 같은 글자 버튼이 둘이면 눌러 본 것을
             또 누르게 된다. 여기는 바로 위에서 제작 과정을 읽은 자리라
             "제작" 쪽이 맥락에도 맞는다. */
          <Link href="/contact" className={BTN}>
            제작 문의하기
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
              className="shrink-0 transition-transform group-hover:translate-x-1"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        }
      >
        {/* 떨어진 그림자 카드다. 사이트의 카드 언어가 rounded-2xl +
            shadow-card 이므로 여기도 같은 모양으로 둔다.

            (한때 "바로 위 유신의 강점 섹션과 겹치지 않게" 라고 적어 두었는데,
            그 섹션을 걷어내 더는 해당되지 않는다.)

            숫자는 brand 다. 네이비 위에서 쓰던 brand-light(#ff6b5e)는 흰
            바탕에서 3.0:1 로 떨어진다(brand #d5261e 는 5.1:1). */}
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {process.map((p, i) => (
            <Reveal
              as="li"
              key={p.step}
              delay={i * 80}
              className="relative rounded-2xl bg-white p-6 shadow-card"
            >
              {/* 숫자와 제목을 한 줄로 묶는다. 전에는 숫자가 3xl 로 혼자
                  한 줄을 차지하고 그 아래 제목.본문이 모두 맨 글자였다 —
                  흰 섹션 위 흰 카드라 카드 자체도 약해서, 칸 전체가 글자만
                  있는 것처럼 보였다.

                  숫자를 한 줄로 올려 번 자리를 본문 박스가 받는다. 숫자는
                  제목과 나란히 서므로 3xl 에서 xl 로 줄인다. */}
              <div className="flex items-baseline gap-2.5">
                <span className="text-xl font-bold tabular-nums text-brand">
                  {p.step}
                </span>
                <h3 className="text-base font-bold text-ink">{p.title}</h3>
              </div>
              {/* 점 목록 셋. 한때 박스 안이 긴 문장 하나였는데, 글상자가
                  좁아 3~4줄로 눌려 읽혔다. 지금은 단계마다 할 일 셋이 한 줄씩
                  선다.

                  회색 박스를 두르지 않는다. 한동안 피더 섹션의 박스 셋을 따라
                  bg-surface 를 깔았는데, 거기는 흰 섹션 위에 바로 놓이는
                  박스라 또렷했고 여기는 이미 흰 카드 안이라 면이 두 겹이 됐다.

                  ol > li 안의 ul 이다 — 단계 목록 안의 세부 목록이라 의미가
                  맞는다. 점은 장식이라 aria-hidden 이고, 목록이라는 사실은
                  ul/li 가 전한다.

                  ⚠️ 항목 길이는 company.ts 의 process 주석을 따른다. */}
              <ul className="mt-4 flex flex-col gap-2">
                {p.points.map((point) => (
                  <li key={point} className="flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className="h-1 w-1 shrink-0 rounded-full bg-brand"
                    />
                    <span className="text-[13px] leading-snug text-ink-soft">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>

              {/* 오른쪽 위에 깔리는 큰 숫자. 목록 글이 짧아 그 자리가
                  비어 있었다 — 카드가 헐겁게 읽히던 까닭이다.

                  시안을 넷 비교했다. 원형 배지는 숫자가 작아져 오히려 약해지고,
                  상단 레드 띠는 넷이 다 가지면 과한 데다 레드 면적이 넓어진다
                  (globals.css 토큰 주석 — "레드는 면적을 좁게"). 이 워터마크가
                  빈 자리를 채우면서 번호를 포인트로 만든다.

                  색이 line/70 인 것은 왼쪽의 작은 숫자와 겹쳐 읽히지 않아야
                  해서다. 장식이라 aria-hidden 이고, 번호는 왼쪽 숫자와 ol 이
                  이미 전한다.

                  ⚠️ 카드에 overflow-hidden 을 주지 말 것. 주면 아래 화살표가
                     카드 밖으로 나간 부분에서 잘린다. 이 숫자는 right-4 top-2
                     라 안쪽에 머문다. */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-4 top-2 text-[56px] font-extrabold leading-none text-line/70"
              >
                {p.step}
              </span>

              {/* 카드 사이를 잇는 화살표. 넷이 나란히 서 있을 뿐 단계가
                  이어지는 표시가 없어 심심했다.

                  -right-[18px] 가 틈 한가운데다 — 카드 간격이 gap-4(16px)이고
                  화살표가 20px 이라 16/2 + 20/2 = 18 이다.

                  lg 부터만 띄운다. 2열(sm)에서는 1→2 는 가로인데 2→3 은 줄이
                  바뀌어, 화살표가 엉뚱한 곳을 가리킨다.

                  장식이라 aria-hidden 이다. 순서는 ol 과 숫자가 이미 전한다. */}
              {i < process.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute -right-[18px] top-1/2 hidden -translate-y-1/2 text-muted/50 lg:flex"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 6l6 6-6 6" />
                  </svg>
                </span>
              )}
            </Reveal>
          ))}
        </ol>
      </Section>

      {/* 6. 제품 영상 — videos.ts가 비어 있으면 통째로 렌더하지 않는다.
             여기는 맛보기 두 편만 걸고 나머지는 /videos 에서 본다. */}
      {featuredVideos.length > 0 && (
        <Section
          tone="surface"
          eyebrow="VIDEO"
          title="제품 영상"
          action={
            /* /videos 와 같은 자리에 둔다. 한쪽만 제목 줄로 올리면 같은
               성격의 두 섹션이 달라 보인다. 글자는 "전체 보기" 그대로다 —
               여기는 /videos 로 가는 내부 링크이고, /videos 쪽은 유튜브로
               나가는 "더 보기" 라 역할이 다르다. */
            <Link href="/videos" className={BTN}>
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
                className="shrink-0 transition-transform group-hover:translate-x-1"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          }
        >
          <ul className="grid gap-6 sm:grid-cols-2 sm:gap-8">
            {featuredVideos.map((v, i) => (
              <Reveal as="li" key={v.id} delay={i * 70}>
                <VideoCard video={v} />
              </Reveal>
            ))}
          </ul>
        </Section>
      )}

      {/* 7. 주요 거래처 */}
      <Section
        eyebrow="CLIENTS"
        title="주요 거래처"
        action={
          /* 격자 아래에 있던 것을 제목 줄로 올린다. 바로 위 VIDEO 섹션이
             "영상 전체 보기" 를 같은 자리에 두는데 여기만 아래에 있어,
             같은 성격의 두 섹션이 달라 보였다. */
          <Link href="/clients" className={BTN}>
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
              className="shrink-0 transition-transform group-hover:translate-x-1"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        }
      >
        <Reveal>
          <ClientGrid names={featuredClients} />
        </Reveal>
      </Section>

      {/* 8. 문의 CTA */}
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
            // 유튜브 채널을 이 회사 것으로 묶어 준다(sameAs 의 용도다).
            sameAs: [site.youtube],
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
