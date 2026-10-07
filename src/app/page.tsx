import Image from "next/image";
import Link from "next/link";
import Container from "@/components/Container";
import ContactCTA from "@/components/ContactCTA";
import ProductCard from "@/components/ProductCard";
import Section from "@/components/Section";
import { process } from "@/data/company";
import ClientGrid from "@/components/ClientGrid";
import Reveal from "@/components/Reveal";
import ScrollCue from "@/components/ScrollCue";
import StatCounter from "@/components/StatCounter";
import { featuredClients, totalClients } from "@/data/clients";
import { performanceKpis, products } from "@/data/products";
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
      {/* 히어로 배경 영상의 정지컷. 영상이 뜨기 전까지 이게 보이므로 미리
          알려 LCP 를 앞당긴다. 영상 자체는 preload 하지 않는다 — 첫 화면
          페인트가 늦어진다. (React 가 이 link 태그를 <head> 로 끌어올린다)

          ⚠️ 한때 layout.tsx 에 있었다. 레이아웃은 열 페이지 전부에 붙으므로,
             이 그림을 쓰지 않는 제품 상세.영상자료.오시는 길에서도 47KB 를
             fetchPriority="high" 로 헛받았다 — 바로 그 자리에서 정작 받아야
             할 제품 사진.구동 영상과 대역을 다퉜다. 홈에만 둔다. */}
      <link
        rel="preload"
        as="image"
        href="/images/hero-poster.webp"
        fetchPriority="high"
      />

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
              {/* 한 문장이다. 전에는 두 문장(63자)이라 데스크톱에서도 두
                  줄, 320~430 에서는 서너 줄이었다.

                  "34년째" 가 빠진 자리를 눈여겨볼 것. 바로 아래 지표 띠가
                  "1992년 설립" 과 "34년 제작 경력" 으로 이미 두 번 말한다 —
                  위 tagline 주석이 SINCE 1992 를 뺀 이유로 적어 둔 바로 그
                  세 겹이다. 한 줄에 담을 수 있는 말이 하나뿐이라면, h1 과
                  지표 띠가 말하지 않는 "보낸 부품에 맞춰 설계한다" 를
                  남기는 쪽이 새 정보를 준다.

                  실측 — 640~1440 에서 1줄, 320~430 에서 2줄. 폰에서 1줄은
                  어떤 후보로도 안 된다(후보 일곱을 폭마다 재 봤다). */}
              <p
                className="rise mt-[clamp(0.75rem,2vh,1.5rem)] max-w-xl text-[clamp(0.875rem,1.9vh,1.125rem)] leading-relaxed text-white/75"
                style={{ animationDelay: "220ms" }}
              >
                볼피더·직진피더·호퍼피더를 부품 샘플에 맞춰 설계합니다.
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

      {/* 3. 제품 성능 */}
      {/* 제품이 무엇을 해내는가를 숫자로 말하는 자리다.

          한동안 여기가 회사를 말하는 자리였다 — "피더를 만드는 데 필요한 것"
          에 부서.설비.쌓인 사례를 적은 글 상자 다섯. 그 전에는 "피더란
          무엇인가" 였다. 글 상자는 읽어야 뜻이 오는데, 홈에서 이 자리를 보는
          사람은 아직 읽을 마음이 없다. 숫자는 보면 바로 온다.

          ⚠️ 바로 위 히어로 지표 띠(1992.34년.34개사.7종)와 축이 다르다 —
             그쪽은 회사의 규모.연혁이고 여기는 기계의 성능이다. 숫자를 더하거나
             바꿀 때 그 넷과 겹치지 않는지 본다.

          버튼(action)을 두지 않는다. 내용이 제품 성능이라 "회사소개 자세히
          보기" 는 결이 안 맞고, "제품 전체 보기" 는 바로 아래 PRODUCTS 섹션
          버튼과 겹친다. /company 동선은 헤더.푸터 메뉴에 있다. 대신 lead
          한 줄이 제목을 받는다. */}
      {/* 제목이 제품의 동작을 그대로 말한다. 한때 "한 자세로, 멈추지
          않고" 에 "부품을 같은 자세로 가려 세워, 라인이 멈추지 않게 합니다"
          라는 리드가 붙어 있었는데, 둘이 같은 말이라 리드를 걷고 제목만
          남겼다. 아래가 바로 영상이라 설명 줄이 더 필요하지 않다.

          후보 다섯을 글상자에 그려 폭마다 쟀다 — 320 에서 2줄, 390 이상
          한 줄이다. */}
      <Section eyebrow="PERFORMANCE" title="쏟아 넣으면 한 줄로 나옵니다">
        {/* 정지 사진이던 자리다. 피더가 무엇인지는 "부품이 돌다가 한 줄로
            서서 나간다" 는 움직임 자체라, 멈춘 사진으로는 절반만 전해졌다.

            히어로가 쓰는 영상을 그대로 건다. 볼피더가 커넥터 부품을 정렬해
            트랙으로 내보내는 10초짜리인데, 히어로에서는 opacity 0.3 에
            네이비 오버레이까지 덮여 거의 안 보인다 — 같은 파일이어도 여기서
            밝게 돌면 다른 영상처럼 읽히고, 이미 받는 파일이라 전송량도
            늘지 않는다.

            1024 미만은 16/9 다 — 영상 원본과 같은 비율이라 아무 데도 잘리지
            않는다. lg 부터는 3/1 로 눕힌다. 전체 폭(1088px)에서 16/9 면
            612px 라 영상이 화면을 다 먹고 아래 KPI 가 밀려난다. 3/1 이면
            363px 이고, 제목.영상.KPI 넷이 1440x900 한 화면에 들어온다.

            object-cover 가 위아래를 자르지만 트랙이 화면을 가로지르는 장면
            이라 부품이 가운데 남는다 — 눈으로 확인했다.

            ⚠️ Image 가 아래 깔려 있는 것은 장식이 아니다. globals.css 의
               prefers-reduced-motion 블록이 .hero-video 를 display:none 으로
               숨기므로, 움직임을 끈 사람에게는 이 정지컷이 보인다. 영상에서
               뽑은 그림이라 장면이 어긋나지 않는다. 지우면 그 사람에게 빈
               칸만 남는다. */}
        <Reveal className="relative aspect-video overflow-hidden rounded-2xl bg-surface lg:aspect-[3/1]">
          <Image
            src="/images/hero-poster.webp"
            alt="커넥터 부품을 정렬해 트랙으로 내보내는 볼피더"
            fill
            sizes="100vw"
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

        {/* KPI 넷. 값 - 라벨 - 조건 세 줄이다.

            ⚠️ dl 이 아니라 ul 이다. 처음에 히어로 지표 띠를 따라 dl/dt/dd 로
               짰다가 Lighthouse 접근성이 96 으로 떨어졌다(definition-list 미통과,
               agent-accessibility-tree 0). dl 의 자식 div 안에는 dt 와 dd 만
               올 수 있는데 조건 줄이 p 라 섞인 탓이다. 히어로 띠가 통과하는
               것은 거기가 dd + dt 둘뿐이라서다.

               여기는 줄이 셋이고 용어-정의 쌍도 아니다 — 측정값 목록이라
               ul/li 가 뜻에도 맞다.

            칸 사이는 세로 구분선이다. 시안 셋(맨 글자 / 구분선 / 회색 박스)을
            찍어 비교했다 — 회색 박스는 아래 제품 카드와 결이 겹쳐 KPI 의
            시원함이 줄고, 맨 글자는 흰 바탕에서 네 덩어리가 흩어져 보인다.
            1열.2열에서는 선이 뜻을 잃으므로 lg 부터만 긋는다.

            lg 부터 가운데 정렬이다. 왼쪽 정렬일 때 네 덩어리가 각 칸의 왼쪽에
            붙어, 전체 폭으로 선 영상과 축이 어긋나 보였다. 1열.2열에서는
            왼쪽을 지킨다 — 좁은 폭에서 가운데로 모으면 글이 떠 보인다.

            ⚠️ lg:pl-7 을 두지 말 것. 구분선과 글을 띄우려고 넣었던 것인데,
               가운데 정렬에서는 왼쪽 패딩만 있으면 글 덩어리가 오른쪽으로
               밀린다. 칸 사이는 lg:gap-7 이 벌린다.

            ⚠️ StatCounter 를 쓰지 않는다. 바로 위 히어로 지표 띠가 이미 세어
               올리고 있어, 한 화면에서 숫자가 두 번 구르면 산만하다. */}
        <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4 lg:gap-7 lg:text-center">
          {performanceKpis.map((kpi, i) => (
            <Reveal
              as="li"
              key={kpi.label}
              delay={i * 80}
              className={i > 0 ? "lg:border-l lg:border-line" : ""}
            >
              <p className="text-[34px] font-extrabold leading-none tracking-tight tabular-nums text-ink">
                {kpi.value}
                <span className="ml-0.5 text-lg font-bold text-brand">
                  {kpi.unit}
                </span>
              </p>
              <p className="mt-2.5 text-sm font-bold text-ink">{kpi.label}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-muted">
                {kpi.note}
              </p>
            </Reveal>
          ))}
        </ul>
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
              {/* 번호 배지 + 제목.

                  ⚠️ /contact 의 "도입 프로세스" 배지와 **글자 그대로 같은
                     클래스**다. 같은 데이터(company.ts 의 process)를 두 자리에
                     쓰면서 번호 꼴이 갈려 있으면, 한쪽을 고칠 때 다른 쪽을
                     잊는다. 둘을 함께 고칠 것.

                  {p.step}("01")이 아니라 {i + 1} 이다 — 24px 원에 두 글자는
                  빽빽하다. step 필드는 key 로 남는다.

                  ⚠️ aria-hidden 을 떼지 말 것. 순서는 ol / li 가 이미 전하므로
                     시각 보조다(/contact 주석과 같은 이유). */}
              <div className="flex items-center gap-2.5">
                <span
                  aria-hidden="true"
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/10 text-[11px] font-bold tabular-nums text-brand"
                >
                  {i + 1}
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

              {/* ⚠️ 한때 여기에 카드 오른쪽 위를 덮는 56px 워터마크 번호가
                     있었다(text-[56px] font-extrabold text-brand/30). 목록 글이
                     짧아 그 자리가 비어 카드가 헐겁게 읽히던 것을 메우려던
                     것이고, 모양 넷(원형 배지 · 상단 레드 띠 · …)과 농도
                     넷(brand/18 · /30 · /45 · line/70)을 비교해 고른 값이었다.

                     걷은 이유는 그 숫자가 제목만큼 무거워 **부담스럽다**는
                     것이다 — 메우려던 문제보다 생긴 문제가 컸다. 다시 넣을
                     생각이라면 그때 비교한 넷을 또 비교하지 말고, 위 배지가
                     /contact 와 통일되어 있다는 점부터 볼 것.

                  ⚠️ 카드의 relative 를 걷지 말 것. 아래 화살표가 -right-[18px]
                     로 카드 밖에 걸쳐 있어 그 기준점이 필요하다. overflow-hidden
                     을 주면 그 부분이 잘린다. */}

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
                {/* preview — 화면에 들어오면 소리 없이 자동으로 돈다.
                    /videos 쪽은 이 prop 을 주지 않아 지금처럼 버튼을 눌러야
                    재생된다. */}
                <VideoCard video={v} preview />
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
