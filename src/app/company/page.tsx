import type { Metadata } from "next";
import { Nanum_Brush_Script } from "next/font/google";
import ContactCTA from "@/components/ContactCTA";
import PageHero from "@/components/PageHero";
import Section from "@/components/Section";
import {
  intro,
  overview,
  philosophy,
  philosophyMotto,
} from "@/data/company";
import { site, yearsInBusiness } from "@/data/site";

/**
 * 대표이사 서명 전용 붓글씨체. 이 페이지 서명 한 줄에서만 쓴다.
 *
 * 루트 레이아웃이 아니라 여기서 부르는 게 핵심이다. 레이아웃에서 부르면
 * 9개 페이지 전부가 @font-face 94개와 안 쓰는 라틴 서브셋 preload 14.3KB 를
 * 짊어진다. 여기서 부르면 그 94개가 /company 전용 CSS(gzip 15.1KB)로 빠져
 * 공용 CSS 가 gzip 24.0 -> 8.3KB 가 된다.
 *
 * preload: false — preload 대상은 라틴 서브셋인데 붓글씨로 쓰는 글자는
 * "이준희" 한글 3자뿐이라 한 글자도 안 쓴다. 한글 청크는 원래 preload 대상이
 * 아니고 브라우저가 필요할 때 받으므로, 이걸 꺼서 새로 생기는 FOUT 은 없다.
 *
 * subsets 에 "latin"만 적어도 한글이 나온다 — 구글이 내려 주는 CSS 가 한글
 * unicode-range 를 함께 담고 있고 next/font 가 그 파일들을 받아 자체
 * 호스팅하기 때문이다. (Noto Sans KR 도 같은 선언이다)
 */
const nanumBrush = Nanum_Brush_Script({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "회사소개",
  description: `1992년 설립 이후 ${yearsInBusiness}년간 파츠피더 한 분야만 만들어 온 유신 F.A 시스템입니다. 회사 소개와 개요, 사회복지·연구개발 두 갈래의 경영이념을 담았습니다.`,
};

export default function CompanyPage() {
  return (
    <>
      <PageHero
        eyebrow="COMPANY"
        title="회사소개"
        lead={`1992년 설립 이후 ${yearsInBusiness}년간, 파츠피더 한 분야만 만들어 온 회사입니다.`}
      />

      {/* 회사 소개글 */}
      {/*
        Section 에 eyebrow·title 을 넘기지 않고 직접 그린다. Section 은 제목을
        children 위의 별도 블록(mb-10 sm:mb-14)에 그리는데, 그러면 오른쪽 패널이
        제목보다 106px 아래에서 시작한다. 제목을 그리드 안으로 넣어야 패널 윗변이
        제목과 맞는다.

        eyebrow·h2 클래스는 src/components/Section.tsx 에서 그대로 옮겨 온 것이다.
        거기 타이포가 바뀌면 이 페이지도 같이 고쳐야 한다.
      */}
      <Section>
        <p className="mb-3 text-xs font-bold tracking-[0.2em] text-brand">
          ABOUT
        </p>
        {/* items-start 를 쓰지 않는다. 그리드 기본값(stretch)이라야 패널이 칸
            높이를 채워 아랫변까지 본문 끝과 맞는다. 윗변은 행이 제목에서
            시작하므로 stretch 로도 그대로 맞는다. */}
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-x-16">
          <div>
            <h2 className="text-2xl font-bold leading-snug tracking-tight text-ink sm:text-4xl">
              {intro.title}
            </h2>
            {/* 제목 아래 여백은 Section 의 헤더 아래 여백과 같은 값으로 맞춘다 */}
            <div className="mt-10 sm:mt-14">
              {intro.paragraphs.map((paragraph, index) => (
                <p
                  key={paragraph.slice(0, 20)}
                  className={
                    // 첫 문단만 키워 소개글이 어디서 시작하는지 잡아 준다.
                    index === 0
                      ? "text-lg leading-[1.85] text-ink sm:text-xl"
                      : "mt-5 text-base leading-[1.9] text-ink-soft"
                  }
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/*
            대표이사 서명. 그리드의 둘째 행에 두고 첫 칸에만 놓는다.
            왼쪽 칸 안에 넣으면 칸이 길어지고 패널이 stretch 로 따라 늘어나
            네이비 빈 공간이 145px 까지 벌어진다. 행을 나누면 패널은 본문 행
            높이만 채워 아랫변이 본문 마지막 줄과 그대로 맞는다.

            DOM 순서는 소개글 -> 서명 -> 패널이라 좁은 화면에서 한 단으로
            쌓여도 읽는 순서가 맞다.

            오른쪽은 이름을 붓글씨 글꼴로 그린 장식이라 aria-hidden 을 건다 —
            안 걸면 스크린리더가 "이준희"를 두 번 읽는다.
          */}
          <div className="flex items-baseline gap-4 border-t border-line pt-6 lg:col-start-1 lg:row-start-2">
            <span className="text-sm font-bold text-ink">
              대표이사 {site.ceo}
            </span>
            {/* 크게 + 자간을 벌려야 사인으로 읽힌다. 30px·자간 0 이면 세 글자가
                붙어 그냥 작은 손글씨가 된다. 기울기(rotate)는 일부러 안 넣었다 —
                이 글꼴에 이미 기울기가 있어 덧붙이면 삐뚤어져 보인다.
                font-bold 를 같이 걸면 안 된다 — 굵기가 400 하나뿐이라 브라우저가
                합성 볼드를 그려 붓획이 뭉갠다. */}
            <span
              aria-hidden="true"
              className={`${nanumBrush.className} text-4xl leading-none tracking-[0.2em] text-ink sm:text-5xl`}
            >
              {site.ceo}
            </span>
          </div>

          {/* 경영이념. 라벨을 한글로 둔 것은 의도다 — 섹션 eyebrow 가 이미
              영문(ABOUT)이라 패널 안에 MANAGEMENT PHILOSOPHY 를 또 두면
              한 섹션에 영문 라벨이 둘이 된다. */}
          <aside className="rounded-lg bg-navy-deep p-7 sm:p-8 lg:col-start-2 lg:row-start-1">
            <p className="text-xs font-bold tracking-[0.2em] text-brand-light">
              경영이념
            </p>
            <p className="mt-3 text-xl font-bold leading-snug text-white sm:text-2xl">
              {philosophyMotto}
            </p>
            <dl className="mt-6 space-y-5 border-t border-white/15 pt-6">
              {philosophy.map((item) => (
                <div key={item.title}>
                  <dt className="text-sm font-bold text-brand-light">
                    {item.title}
                  </dt>
                  <dd className="mt-1.5 text-sm leading-[1.8] text-white/75">
                    {item.body}
                  </dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </Section>

      {/* 회사 개요 */}
      <Section tone="surface" eyebrow="OVERVIEW" title="회사 개요">
        {/*
          한 줄에 한 항목. 라벨을 왼쪽 고정 열(grid-cols-[7rem_1fr])에 두는 게
          이 표의 핵심이다 — 값이 전부 같은 x 에서 시작해 눈이 아래로만 내려간다.

          라벨과 값 사이 세로 구분선은 dt 의 border-r 이다. 다만 세로 패딩을
          행이 아니라 dt/dd 가 들고 있어야 선이 행 끝까지 이어진다 — 행에
          패딩이 남아 있으면 위아래 14px 씩 끊겨 점선처럼 보인다(실측 46%).

          폭이 남는 게 아까워 값 길이에 맞춰 칸을 나눈 적이 있는데(6열 격자),
          그러면 값 시작점이 행마다 달라져(실측 4종류) 훑기가 어려워진다.
          빈칸보다 정렬선이 중요하다.

          라벨은 값보다 작게 두되 네이비로 눈에 걸리게 한다. 처음엔 라벨이
          굵은 검정이고 값이 흐려 위계가 뒤집혀 있었는데, 그걸 고치면서 라벨을
          너무 눌러 이번엔 훑을 기준선이 없어졌다. 크기로 위계를 두고 색으로
          두 열을 가른다. (네이비는 설비 대수·본문 링크에 이미 쓰는 강조색이다)
        */}
        <dl className="overflow-hidden rounded-lg border border-line bg-white">
          {overview.map((row) => (
            <div
              key={row.label}
              className="border-b border-line px-6 last:border-b-0 sm:grid sm:grid-cols-[7rem_1fr]"
            >
              {/* sm:leading-[1.875] — 13px x 1.875 = 24.375px 로, 값(15px x 1.625)의
                  줄 상자와 같게 맞춘다. 격자는 baseline 정렬이 아니라 이렇게 해야
                  라벨과 값의 밑줄이 맞는다(남는 차 1.8px).
                  sm:w-28 을 쓰면 안 된다 — dt 폭이 고정돼 격자 열 설정을 덮어쓴다. */}
              <dt className="pt-3.5 text-[13px] font-bold tracking-[0.1em] text-navy sm:border-r sm:border-line sm:py-3.5 sm:pr-6 sm:leading-[1.875]">
                {row.label}
              </dt>
              {/* tabular-nums: 대표번호와 팩스가 위아래로 붙어 있어 자릿수를
                  맞춰야 한다. 한글 값에는 아무 영향이 없다. */}
              <dd className="mt-1.5 pb-3.5 text-[15px] leading-relaxed tabular-nums text-ink sm:mt-0 sm:py-3.5 sm:pl-6">
                {/* 전화·이메일은 눌러서 걸고 보낼 수 있게 한다. 팩스는 걸 수
                    없어 href 가 없다 — 푸터·헤더·문의하기·오시는 길과 같은 규칙. */}
                {row.href ? (
                  <a
                    href={row.href}
                    className="transition-colors hover:text-brand"
                  >
                    {row.value}
                  </a>
                ) : (
                  row.value
                )}
                {/* 영문 상호는 링크 밖에, 같은 줄에 붙인다 */}
                {row.sub && (
                  <span className="ml-2.5 text-xs font-medium tracking-[0.08em] text-muted">
                    {row.sub}
                  </span>
                )}
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      <ContactCTA />
    </>
  );
}
