import type { Metadata } from "next";
import { Nanum_Brush_Script } from "next/font/google";
import Image from "next/image";
import ContactCTA from "@/components/ContactCTA";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import Section from "@/components/Section";
import {
  intro,
  overview,
  philosophy,
  philosophyMotto,
} from "@/data/company";
import { site, telHref, yearsInBusiness } from "@/data/site";

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
      {/* 숫자는 yearsInBusiness 에서 뽑는다 — 해가 바뀌면 문구도 따라 바뀐다.
          "한 분야만 만들어 온 회사" 를 "한 분야에만 집중해 온 전문 제조사" 로
          바꿨다. 같은 사실이지만 거래처를 고르는 쪽이 찾는 말에 가깝다. */}
      <PageHero
        eyebrow="COMPANY"
        title="회사소개"
        lead={`1992년부터 ${yearsInBusiness}년, 파츠피더 한 분야에만 집중해 온 전문 제조사입니다.`}
      />

      {/* 회사 소개글 + 경영이념 패널 */}
      {/*
        Section 에 eyebrow·title 을 넘기지 않고 직접 그린다. 이유가 둘이다.

        하나는 Section 이 제목을 children 위의 **별도 블록**(mb-10 sm:mb-14)에
        그린다는 것이다. 그러면 오른쪽 경영이념 패널이 제목보다 106px 아래에서
        시작한다 — 제목을 그리드 안에 넣어야 패널 윗변이 제목과 맞는다.

        다른 하나는 **h2 안에 로고 이미지가 들어간다**는 것이다(아래
        intro.title.brand 를 YUSIN 마크로 대신한다). Section 의 title 은
        string 만 받는다.

        ⚠️ 한동안 이 섹션이 1열(max-w-3xl)이었다. 경영이념 패널을 독립 네이비
           섹션으로 빼냈던 때인데, "이준희 옆에 넣으려 했지 밑에다가 크게 만들
           생각은 없었다" 는 말에 패널을 여기로 되돌렸다. 그 라운드에 사진이
           들어왔으므로 지금은 패널 안에 56px 썸네일이 함께 있다.

        eyebrow·h2 클래스는 src/components/Section.tsx 에서 그대로 옮겨 온 것이다.
        거기 타이포가 바뀌면 이 페이지도 같이 고쳐야 한다.
      */}
      <Section>
        <Reveal className="mb-3">
          <p className="text-xs font-bold tracking-[0.08em] text-brand">ABOUT</p>
        </Reveal>
        {/* items-start 를 쓰지 않는다. 그리드 기본값(stretch)이라야 패널이 칸
            높이를 채워 아랫변까지 본문 끝과 맞는다. 윗변은 행이 제목에서
            시작하므로 stretch 로도 그대로 맞는다. */}
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-x-16">
          {/* 그리드 칸이 곧 Reveal 이다 — 래퍼를 덧대면 칸이 하나 더 생겨
              패널 아랫변 정렬이 깨진다. */}
          <Reveal>
            {/* 마지막 낱말을 로고의 YUSIN 마크로 대신한다.

                사이트에서 글 안에 이미지를 넣는 유일한 자리다 — 다른 Image 는
                전부 블록 컨테이너의 직계 자식이고, 브랜드도 읽는 글에서는 한글
                "유신" 으로만 쓴다(영문은 로고 이미지, 회사 개요 영문 부기,
                WHY YUSIN eyebrow 세 군데뿐). 여기 한 곳만의 예외로 두고 다른
                제목으로 번지지 않게 한다 — 번지면 한글 표기 규칙이 무너진다.

                alt 를 비우지 않는다. 이미지가 글자를 대신하므로 비우면 제목이
                "변화에 앞서가는 기업," 에서 끊겨 읽힌다.

                h-[0.78em] 로 글자 크기에 매어 둔다 — 24px 제목에서 19px,
                36px 에서 28px 로 따라 커진다. top 은 밑선을 맞추는 값이다
                (마크에 기울기와 꼬리가 있어 그냥 두면 살짝 뜬다). */}
            <h2 className="text-2xl font-bold leading-snug tracking-tight text-ink sm:text-4xl">
              {intro.title.lead}{" "}
              <Image
                src="/images/logo-mark.webp"
                alt={intro.title.brand}
                width={129}
                height={32}
                className="relative top-[0.06em] inline-block h-[0.78em] w-auto align-baseline"
              />
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
          </Reveal>

          {/*
            대표이사 서명. 그리드의 둘째 행에 두고 첫 칸에만 놓는다.

            ⚠️ 왼쪽 칸 **안**에 넣지 말 것. 그러면 칸이 길어지고 오른쪽 패널이
               stretch 로 따라 늘어나 네이비 빈 공간이 145px 까지 벌어진다.
               행을 나누면 패널은 본문 행 높이만 채워 아랫변이 본문 마지막
               줄과 그대로 맞는다.

               (패널을 독립 섹션으로 빼냈던 동안에는 이 자리 지정을 걷고 mt-10
               으로 띄웠다. 패널이 돌아오면서 함께 되살렸다.)

            DOM 순서는 소개글 -> 서명 -> 패널이라 좁은 화면에서 한 단으로
            쌓여도 읽는 순서가 맞다.

            오른쪽은 이름을 붓글씨 글꼴로 그린 장식이라 aria-hidden 을 건다 —
            안 걸면 스크린리더가 "이준희"를 두 번 읽는다.
          */}
          <Reveal
            delay={140}
            className="flex items-baseline gap-4 border-t border-line pt-6 lg:col-start-1 lg:row-start-2"
          >
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
              className={`${nanumBrush.className} sign-ink text-4xl leading-none tracking-[0.08em] text-ink sm:text-5xl`}
            >
              {site.ceo}
            </span>
          </Reveal>

          {/* 경영이념 패널.

              ⚠️ 라벨을 한글로 둔 것은 의도다 — 섹션 eyebrow 가 이미 영문
                 (ABOUT)이라 패널 안에 MANAGEMENT PHILOSOPHY 를 또 두면 한
                 섹션에 영문 라벨이 둘이 된다.

              ⚠️ 한 라운드 동안 이것이 독립 네이비 섹션이었다(PHILOSOPHY,
                 2열 카드에 16:9 사진과 파란 그라데이션 자막). "이준희 옆에
                 넣으려 했지 밑에다가 크게 만들 생각은 없었다" 는 말에
                 되돌렸고, 그때 들어온 사진은 **56px 썸네일**로 남겼다.

              ⚠️ 썸네일이 56px 인 데는 이유가 있다. 패널 안쪽이 1024 에서
                 319px 뿐이라(p-7 기준) 그보다 키우면 글 칸이 남지 않는다.
                 56 + gap 14 = 70px 를 쓰고 글에 249px 가 남는다.

              ⚠️ 자막 그라데이션은 여기 없다. 56px 사진 위에는 글을 얹을 수
                 없어서다 — caption 이 사진 **옆**의 글이 됐다. 그래서
                 company.ts 의 "어느 폭에서나 한 줄" 규칙도 걷었다(두 줄이
                 되어도 괜찮다).

              ⚠️ dl 이 아니라 ul 이다. 한때 dt/dd 쌍이었는데 사진이 들어오면서
                 한 항목이 "사진 + 제목 + 글" 셋이 됐다. dl 의 자식 div 안에는
                 dt 와 dd 만 올 수 있어 접근성 검사(definition-list)가 걸린다 —
                 제품 상세 KPI 가 같은 이유로 ul 이다. */}
          <Reveal
            as="aside"
            delay={80}
            className="rounded-2xl bg-navy-deep p-7 sm:p-8 lg:col-start-2 lg:row-start-1"
          >
            <p className="text-xs font-bold tracking-[0.08em] text-brand-light">
              경영이념
            </p>
            <p className="mt-3 text-xl font-bold leading-snug text-white sm:text-2xl">
              {philosophyMotto}
            </p>
            {/* **가로 두 칸이다** — 사회복지 | 연구개발 이 나란히 서고 각
                칸에서 제목 아래로 사진이 깔린다.

                ⚠️ 한 라운드 동안 세로 2행이었다(56px 썸네일 + 글이 가로).
                   요청한 그림은 "사회복지 연구개발을 열로 두고 밑에 사진" 이라
                   되돌렸다.

                ⚠️ 칸이 좁다. 1024 에서 패널 안쪽이 319px 이라 한 칸이 154px,
                   사진이 87px 다. 그래서 자막 글이 **130px 안에** 들어가야
                   한다 — company.ts 의 caption 주석에 측정값이 있다. */}
            <ul className="mt-6 grid grid-cols-2 gap-3 border-t border-white/15 pt-6">
              {philosophy.map((item) => (
                <li key={item.title}>
                  {/* ⚠️ text-center 다 — 제목과 아래 자막 둘 다. 한동안 왼쪽
                         정렬이었는데, 둘이 사진 칸(aspect-[3/2] w-full)과 같은
                         폭을 쓰므로 왼쪽에 붙으면 사진은 칸을 가득 채우고
                         글만 한쪽으로 쏠려 **축이 둘**로 보였다. 가운데로
                         두면 사진.제목.자막이 한 축에 선다.

                      ⚠️ 세로 치수는 1px 도 안 바뀐다. 아래 aspect-[3/2] 와
                         mt-2.5 를 건드리지 말 것(패널 높이 근거가 거기 있다). */}
                  <p className="text-center text-sm font-bold text-brand-light">
                    {item.title}
                  </p>
                  {/* bg-navy 는 사진이 뜨기 전 자리를 지킨다. 패널이
                      navy-deep 이라 한 단계 밝은 navy 가 칸으로 보인다.
                      rounded-lg 는 패널(rounded-2xl)보다 두 단계 작다 — 작은
                      칸에 같은 반경을 주면 모서리만 눈에 띈다. */}
                  {/* ⚠️⚠️ **3:2 다.** 이 비율이 패널 높이를 정하고, 패널
                       높이가 왼쪽 본문과 맞아야 한다 — 1280 에서 잰 값이다.

                         사진 비율  패널   패널 아랫변 - 본문 마지막 줄  안 여백
                         16:9       328    1px                        20px
                         **3:2**    328    **1px**                     1px
                         4:3        342    15px  <- 패널이 내려간다      0px

                       16:9 는 패널 안에 20px 이 남아 "사진 밑이 비었다" 는 말을
                       들었고, 4:3 은 그 여백을 없애는 대신 패널이 14px 길어져
                       **본문 마지막 줄보다 아래에서 끝났다.** 3:2 가 둘을 다
                       만족하는 유일한 값이다 — 사진은 104 -> 123px 로 커지면서
                       패널 높이는 328px 그대로다.

                       ⚠️ 비율을 바꾸면 **패널 아랫변과 본문 마지막 줄의 차**를
                          1280 에서 다시 잰다. 사진 크기만 보면 안 된다.

                       ⚠️ 1024 에서는 여백이 89px 남는다. 그 폭은 패널이 본문보다
                          짧아 격자 stretch 로 늘어나는 쪽이라 사진을 키워도
                          남는 자리가 생긴다. 거기까지 없애려면 1:1(153x153)이
                          되는데, 그러면 16:9 원본이 크게 잘린다. */}
                  <div className="relative mt-2.5 aspect-[3/2] w-full overflow-hidden rounded-lg bg-navy">
                    <Image
                      src={item.photo}
                      alt={item.photoAlt}
                      fill
                      sizes="190px"
                      className="object-cover"
                    />
                    {/* 사진 위 자막. 홈 PROCESS 카드 · 제품 구동 영상과 같은
                        꼴이다 — 파란 그라데이션 위에 흰 글 한 줄.

                        ⚠️ <Image> 가 아니라 **칸**의 자식이다. 그래야 사진이
                           아직 안 떴거나 못 받았을 때도 띠가 남는다.

                        px-3 pb-2 pt-6 — 사이트에서 가장 작은 자막이다. 사진이
                        1024 에서 87px 뿐이라 PROCESS(px-3 pb-2.5 pt-8, 사진
                        99~119px)보다도 줄였다.

                        pointer-events-none — 누를 것이 없다. */}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-deep/85 via-navy-deep/40 to-transparent px-3 pb-2 pt-6">
                      <p className="text-center text-xs font-medium leading-snug text-white">
                        {item.caption}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Section>

      {/* 회사 개요 */}
      {/* ⚠️ border-t 가 있다. 이 섹션도 위 ABOUT 도 **흰 섹션**이라 그냥 두면
             둘이 맞붙어 경계가 사라진다.

             한 라운드 동안 그 사이에 네이비 PHILOSOPHY 섹션이 서 있어서 이
             선이 필요 없었는데, 그 섹션을 ABOUT 패널로 되돌리면서 다시
             맞붙게 됐다. tone="surface" 로 가르는 길은 막혀 있다 — 아래 표가
             선뿐이라 회색 바탕에서 border-line 이 대비 1.15:1 로 사라진다.

             선 색이 아래 표와 같은 border-line 이라 결이 맞는다. */}
      <Section
        eyebrow="OVERVIEW"
        title="회사 개요"
        className="border-t border-line"
      >
        {/*
          한 줄에 한 항목. **오시는 길 연락처 표와 같은 디자인이다** — 선뿐인
          목록(border-t 한 줄 + 행마다 border-b)이고 바탕도 그림자도 테두리도
          없다. 라벨은 13px 회색, 값은 15px 먹색이다. 사이트의 표가 세 가지
          다른 꼴이던 것을 하나로 모은 결과다.

          ⚠️ 그래서 **tone="surface" 를 쓸 수 없다.** 이 표는 선만으로 서므로
             회색 바탕 위에서는 border-line 이 대비 1.15:1 로 거의 사라진다.
             흰 섹션이어야 한다. 바로 위 PHILOSOPHY 가 네이비라 흰 섹션 둘이
             맞붙지는 않는다 — 그 섹션을 빼거나 색을 바꾸면 여기도 다시 본다.

          ⚠️ 라벨 폭이 w-16(64px), sm 부터 w-20(80px)이다. 13px bold 로 가장
             긴 라벨이 56.6px("제작 품목")이고 열한 행 모두 80px 미만이라 들어간다.
             **라벨을 바꿀 때 이 80px 를 넘기지 말 것**(연락처 표도 같은 값이고
             거기 "사업자등록번호"(84px)는 못 들어간다고 적혀 있다).

          ⚠️ **lg(1024)부터 짧은 행을 2열로 짝짓는다.** 그 아래에서는 1열이다 —
             640 에서 접어 보니 한 칸의 값 자리가 160px 뿐이라 회사명(229px)
             부터 두 줄이 됐다(실측). 오시는 길 연락처 표도 같은 이유로
             lg:grid-cols-2 다.

          ⚠️ 값이 긴 세 행(소재지 · 주 사업 ·
             제작 품목)은 데이터의 wide 플래그로 전폭(sm:col-span-2)에 둔다.

             전부 접으면 그 셋이 두 줄이 된다 — 2열 한 칸의 글상자가 424px
             인데 소재지가 435px, 주 사업이 457px 다(실측). 제작 품목은
             346px 라 들어가지만 짝이 없어 전폭으로 둔다.

             ⚠️ 순서는 여전히 뜻을 갖는다 — 회사 자체(회사명 · 설립연도 ·
                자본금 · 대표) -> 어떻게 닿나(소재지 · 대표번호 · 팩스 ·
                이메일 · 홈페이지) -> 무엇을 하나(주 사업 · 제작 품목).
                짝이 그 묶음 **안에서만** 지어지므로 차례가 깨지지 않는다.
                행을 더하거나 뺄 때 이 짝이 묶음을 넘지 않는지 본다.

          ── 아래는 이 표가 흰 카드 + 세로 구분선이던 때의 기록이다.
             되돌릴 일이 있으면 그때 측정값이 여기 남아 있다.

          · 라벨을 격자 고정 열(grid-cols-[7rem_1fr])에 두는 것이 핵심이었다 —
            값이 전부 같은 x 에서 시작해야 눈이 아래로만 내려간다. **그 성질은
            지금도 지켜진다.** flex 로 바뀌었지만 dt 가 w-16/sm:w-20 고정폭이고
            shrink-0 이라 값 시작점이 행마다 같다.
          · 세로 구분선(dt 의 border-r)을 쓰려면 세로 패딩을 행이 아니라
            dt/dd 가 들어야 했다 — 행에 패딩이 남으면 선이 위아래 14px 씩
            끊겨 점선처럼 보였다(실측 46%). **지금은 세로선 자체가 없어** 패딩이
            행(py-4)으로 돌아갔다.
          · 폭이 남는 게 아까워 값 길이에 맞춰 6열 격자로 나눈 적이 있는데,
            값 시작점이 행마다 달라져(실측 4종류) 훑기가 어려워졌다. 빈칸보다
            정렬선이 중요하다.
          · 라벨이 네이비였다. 지금은 연락처 표와 같은 text-muted 회색이다 —
            위계는 크기(13 vs 15px)가, 열 구분은 색이 맡는 방식 자체는 같다.
          · "sm:w-28 을 쓰면 안 된다(dt 폭이 고정돼 격자 열 설정을 덮어쓴다)"
            는 **무효다.** 격자가 아니라 flex 이므로 w-* 가 바로 그 방식이다.
        */}
        <dl className="grid border-t border-line lg:grid-cols-2 lg:gap-x-12">
          {/* 행 자체를 Reveal 로 만든다(as="div") — 래퍼가 끼면 dl > div > dt/dd
              구조가 깨진다. 45ms 씩 밀어 표가 한 줄씩 채워지게 한다.
              (연락처 표는 dl 전체가 한 겹의 Reveal 이다. 거기는 여섯 칸이고
              여기는 열한 행이라 한 줄씩 채워지는 편이 길이를 덜 느끼게 한다.) */}
          {overview.map((row, i) => (
            <Reveal
              key={row.label}
              delay={i * 45}
              /* ⚠️ items-center 다. 대표번호처럼 값이 여러 줄인 행에서 라벨이
                 맨 위에 붙어 보였다(중심이 37px 위). 연락처 표도 같은 이유로
                 items-center 를 쓴다 — 거기는 2열 격자 행의 높이를 두 칸이
                 나눠 갖기 때문이고, 여기는 값 자체가 여러 줄이기 때문이다. */
              className={`flex items-center gap-4 border-b border-line py-4 ${
                row.wide ? "lg:col-span-2" : ""
              }`}
            >
              <dt className="w-16 shrink-0 text-13 font-bold text-muted sm:w-20">
                {row.label}
              </dt>
              {/* tabular-nums: 대표번호와 팩스가 위아래로 붙어 있어 자릿수를
                  맞춰야 한다. 한글 값에는 아무 영향이 없다. */}
              <dd className="text-15 leading-relaxed tabular-nums text-ink">
                {/* 전화·이메일은 눌러서 걸고 보낼 수 있게 한다. 팩스는 걸 수
                    없어 href 가 없다 — 푸터·헤더·문의하기·오시는 길과 같은 규칙. */}
                {(Array.isArray(row.value) ? row.value : [row.value]).map(
                  (value, vi) => (
                    <span key={value} className="block">
                      {row.link ? (
                        <a
                          href={
                            row.link === "tel"
                              ? telHref(value)
                              : `mailto:${value}`
                          }
                          className="transition-colors hover:text-brand"
                        >
                          {value}
                        </a>
                      ) : (
                        value
                      )}
                      {/* 영문 상호는 링크 밖에, 첫 줄에 붙인다 */}
                      {vi === 0 && row.sub && (
                        <span className="ml-2.5 text-xs font-medium tracking-[0.08em] text-muted">
                          {row.sub}
                        </span>
                      )}
                    </span>
                  ),
                )}
              </dd>
            </Reveal>
          ))}
        </dl>
      </Section>

      <ContactCTA />
    </>
  );
}
