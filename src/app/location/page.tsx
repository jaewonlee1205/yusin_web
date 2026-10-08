import type { Metadata } from "next";
import type { ReactNode } from "react";
import ContactCTA from "@/components/ContactCTA";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import { site, telHref } from "@/data/site";

export const metadata: Metadata = {
  title: "오시는 길",
  description: `${site.name} 위치 안내. ${site.address.road}`,
};

/**
 * 지도는 API 키가 필요 없는 구글 지도 embed 를 쓴다.
 *
 * ⚠️ q 에 **좌표**를 넘긴다. 한때 지번 문자열(site.address.jibun)을 검색어로
 *    넘겼는데, 구글이 검색 결과를 찾으면 지도 왼쪽 위에 "1288-2 / 대한민국
 *    경기도 시흥시 정왕동 1288-2 / [지도에서 열기][길찾기]" 흰 카드를 띄운다.
 *    좌표에는 그 카드가 붙지 않는다. 네 가지를 그려서 비교한 결과다 —
 *
 *      지번 검색 z=16   흰 카드 뜸 + 주변 상점 핀 10개 넘음  (한때 이것)
 *      q=좌표   z=17   카드 없음, 핀만
 *      ll=좌표  z=17   핀이 사라지는 대신 "지도에서 열기" 버튼이 뜬다
 *      q=좌표   z=18   카드 없음 + "동우디지털파크" 건물 라벨이 보인다  <- 지금
 *
 * ⚠️ z=18 이다. 16 에서는 주변 상점(타이어프로.88순대국.모스크…)이 열 개 넘게
 *    뜨고, 18 이면 그것들이 밀려나는 대신 건물 이름이 보인다. 더 당기면 큰길
 *    맥락이 사라진다.
 *
 * TODO: 도로명 주소가 확정되면 site.address 를 고치고 지도 위치를 확인할 것.
 */
const MAP_SRC = `https://maps.google.com/maps?q=${site.coords.lat},${site.coords.lng}&z=18&hl=ko&output=embed`;

/**
 * 표의 칸은 컴포넌트 안에서 만든다(아래 cells). 전화와 운영 시간이 값을
 * 두 줄로 그려야 해서 문자열 배열로는 담기지 않는다.
 *
 * 칸 수는 자유롭다. 2열 목록이 행 우선으로 흐르고 선이 칸마다 붙으므로,
 * 홀수여도 마지막 한 칸이 왼쪽에 서고 끝날 뿐 테두리가 끊기지 않는다.
 * (한때 2열 x 3행 격자라 여섯에 묶여 있었다 — 그때는 일곱이면 빈 칸이 생겼다.)
 *
 * 마지막 칸은 두 번 바뀌었다. 사업자번호는 거래 서류에 적는 값이지 연락하는
 * 방법이 아니었고, 대표 이름은 연락처이긴 해도 "오시는 길" 에서 찾는 것이
 * 아니었다. 주차는 이 페이지에 온 사람이 주소 다음으로 궁금해하는 것이다.
 *
 * ⚠️ 도로명(정왕천로 197)은 화면에 넣지 않는다. 한때 따로 한 행이었고 그
 *    다음에는 주소 칸의 둘째 줄이었는데, 주소 윗줄이 이미 건물명까지
 *    말하고 바로 위에 지도가 있어 같은 곳을 두 번 적는 줄이었다.
 *    값은 site.address.roadName 에 남아 있다 — 호수가 확인되면 road 를
 *    그 도로명으로 갈아 끼울 때 쓴다(site.ts TODO 1).
 *
 *    다시 넣지 말 것. "2열에 맞추려면 여섯 칸" 이라는 조건만 보고 빈
 *    자리를 찾으면 여기가 먼저 눈에 띈다.
 *
 * ⚠️ 한때 "내비게이션 | 동우디지털파크로 검색" 행이 있었다. 표의 다른 칸은
 *    모두 값인데 거기만 쓰는 방법을 일러 주는 안내문이라 결이 달랐다.
 *    건물명은 주소 칸에 이미 들어 있다.
 *
 * ⚠️ 대중교통 안내는 이 페이지에 **아예 두지 않는다.** 한때 표 아래에 회색
 *    박스로 "수인·분당선 정왕역 / 시화공단 방면 시내버스 환승" 과 네이버·
 *    카카오 길찾기 버튼을 두었는데, 걷어 달라는 요청에 통째로 뺐다.
 *
 *    역 이름 말고는 적을 것이 애초에 없기도 했다 — 노선이 자료마다 엇갈리고
 *    (1광명.25.8856 <-> 20-1.11-A.11-B) 건물 앞 정류장 이름은 확인할 출처가
 *    한 곳뿐이라, 틀리게 적으면 방문객이 헤맨다. 길찾기는 위 구글 지도와
 *    푸터의 네이버 지도 링크가 맡는다.
 *
 *    다시 넣는다면 site.ts 의 coords 와 icons.tsx 의 KakaoIcon 이 그대로
 *    남아 있다(둘 다 그 주석에 "지금은 쓰이지 않는다" 를 적어 뒀다).
 *
 * ⚠️ 라벨 칸이 좁다. dt 가 w-16(64px), sm 부터 w-20(80px) 이다 — 13px bold
 *    로 "운영 시간" 이 63px 라 sm 부터 한 줄이고 그 아래에서는 두 줄이 된다.
 *    "사업자등록번호"(84px)는 어디서도 안 들어간다. 라벨을 바꿀 때 이 80px 를
 *    넘기지 말 것.
 */

export default function LocationPage() {
  /* 연락처 여섯 칸. lg 2열에서 행 우선으로 흐른다 —
       전화 | 주소
       팩스 | 이메일
       주차 | 운영 시간

     "언제 가면 되나"(운영 시간)가 맨 끝인 이유: 어디로.어떻게를 먼저 읽고
     그것이 뒤따르는 순서가 자연스럽다. */
  const cells: { label: string; body: ReactNode }[] = [
    {
      label: "전화",
      /* 대표번호는 ink-soft(주소.팩스.이메일과 같은 색), 추가 회선은 한 단계
         연한 muted 다. 크기는 둘 다 표의 다른 값과 같은 14px 로 둔다.

         site.ts 는 대표번호(tel)와 추가 회선(telExtra)을 나눠 두는데, 세
         번호를 똑같이 쌓으면 그 구분이 묻혀 어디로 걸어야 하는지가 화면에서
         사라진다. 가르는 수단은 색 하나다 — 한동안 크기(15px)와
         굵기(semibold)까지 함께 썼는데, 그러면 표 안에 글자 크기가
         13/14/15px 세 가지가 되고 그중 둘만 굵어 눈이 두 번 멈췄다. */
      body: (
        <>
          <a
            href={telHref(site.tel)}
            className="block tabular-nums text-ink-soft transition-colors hover:text-brand"
          >
            {site.tel}
          </a>
          <span className="mt-1 block text-muted">
            {site.telExtra.map((number, i) => (
              <span key={number}>
                {i > 0 && " · "}
                <a
                  href={telHref(number)}
                  className="tabular-nums transition-colors hover:text-brand"
                >
                  {number}
                </a>
              </span>
            ))}
          </span>
        </>
      ),
    },
    /* 이름은 road 지만 담긴 값은 지번이다 — 호수 표기가 확인되면 도로명으로
       바꾼다(site.ts TODO 1). 건물명(동우디지털파크)과 호수가 그 안에 이미
       들어 있어 이 칸 하나로 충분하다. */
    { label: "주소", body: site.address.road },
    /* 팩스는 걸 수 없어 링크가 없다(헤더.푸터.CTA와 같은 규칙). */
    { label: "팩스", body: <span className="tabular-nums">{site.fax}</span> },
    {
      label: "이메일",
      body: (
        <a
          href={`mailto:${site.email}`}
          className="transition-colors hover:text-brand"
        >
          {site.email}
        </a>
      ),
    },
    { label: "주차", body: site.parking },
    {
      label: "운영 시간",
      /* CTA와 푸터에도 같은 값이 나오지만 그 둘은 모든 페이지에 깔리는 사이트
         크롬이고, 여기서는 방문 시간이다.

         한때 이 아래 "길찾기 | 네이버 지도 · 카카오맵" 칸이 하나 더 있었다.
         표의 다른 칸은 모두 값인데 거기만 나가는 링크 둘이라 결이 달랐다.
         지도앱으로 가는 길은 푸터에 남아 있다. */
      body: (
        <>
          <span className="block tabular-nums">{site.hours.weekday}</span>
          <span className="mt-1 block text-muted">{site.hours.holiday}</span>
        </>
      ),
    },
  ];

  return (
    <>
      {/* "시화공단 내에 위치해 있습니다" 는 바로 아래 주소를 한 번 더 말할
          뿐이었다. 설계실과 공장이 한자리에 있다는 사실로 바꾸면, 와서 볼
          것이 있다는 뜻이 된다.

          그런데 그 문구("시화공단에 설계실과 공장이 함께 있습니다")도 결국
          조직도 배너와 같은 말이었다 — 거기는 "영업·설계·가공·튜닝·조립,
          다섯 부서가 한 공장 안에 모두 있습니다" 로 훨씬 구체적이다. 같은
          사실을 둘로 줄여 다시 말하니 힘이 빠졌고, "시화공단" 은 아래 주소
          표에 또 나왔다.

          지금 문구는 이 페이지만 할 수 있는 말을 한다. 오시는 길이 답할 것은
          "어디냐"(주소 표가 답한다)가 아니라 "가면 무엇이 되느냐" 다.
          문의하기 배너("샘플이나 도면 한 장이면 됩니다")와 짝이 되되 겹치지
          않는다 — 거기는 보내는 길, 여기는 들고 오는 길이다.

          길이는 글자 수가 아니라 폭이 정한다. 후보 여섯을 실제 배너 글상자에
          그려 320 에서 두 줄, 640 에서 한 줄인 것만 남겼다(39자). */}
      <PageHero
        eyebrow="LOCATION"
        title="오시는 길"
        lead="샘플을 들고 오시면 현장에서 함께 검토합니다. 방문 전 연락 바랍니다."
      />

      <div className="py-14 sm:py-20">
        <Container>
          {/* 지도가 위, 연락처가 그 아래로 눕는다. 둘 다 전폭 1열이다.

              순서를 **네 번** 바꿨다.

                1) 지도가 위  — 1088x462 라 1440 에서 바닥이 863px 였고,
                                전화번호를 보려면 반드시 한 번 굴려야 했다
                2) 2열        — 지도 약 620px + 오른쪽 연락처
                3) 연락처가 위 — 다시 전폭 1열. 그 스크롤 문제가 사라졌다
                4) 지도가 위  — 지금. 요청이다

              ⚠️ 1번의 스크롤 문제로 **되돌아간 것이 아니다.** 그때와 다른 점이
                 둘 있다 — 지도를 3:1 로 눕혀 462 -> 363px 가 됐고(99px), 표를
                 2열 x 3행으로 접어 382 -> 207px 가 됐다(175px). 세로를 274px
                 덜 쓰므로 1440 에서 연락처 첫 줄이 첫 화면 안에 들어온다.
                 그래도 전화번호가 **배너 바로 아래**에 있던 3)보다는 낮다.

                 그래서 위 압축은 절대 되돌리지 말 것 — 지도를 다시 세우거나
                 표를 1열로 펴면 1번 상태가 그대로 돌아온다.

              lg 미만에서는 지도가 고정 높이로 서고 표가 1열로 떨어진다. */}
          <div className="flex flex-col gap-10">
            {/* lg 부터 3:1 이다(1088x363) — 홈 PERFORMANCE 영상과 같은
                비율로 가로로 시원하게 눕는다. 한때 칸 높이를 받는 lg:flex +
                lg:min-h-[25rem] 였는데, 그건 오른쪽에 연락처가 있어 행 높이를
                그쪽이 정하던 2열 배치에서 쓰던 방식이다.

                lg 미만은 고정 높이다 — 좁은 폭에서 3:1 로 두면 지도가 너무
                납작해져 길이 안 보인다.

                아래 표와 함께 테두리로 선다(2D). 그림자로 띄우면 지도.표가
                입체로 읽혀 자료를 읽는 자리에 맞지 않고, 한쪽만 바꾸면
                위아래로 선 둘의 결이 갈린다.

                ⚠️ delay 가 없다(0). 이 블록이 위에 있으므로 아래 연락처(90)보다
                   먼저 떠야 한다 — 순서를 다시 바꾸면 이 숫자도 함께 뒤집는다. */}
            <Reveal className="overflow-hidden rounded-2xl border border-line">
              <iframe
                src={MAP_SRC}
                title={`${site.name} 위치 지도`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                /* saturate-50 — 구글 기본 색(초록 공원 · 주황 상점 · 파란 물)이
                   사이트의 회색 톤과 겉돈다. 절반으로 낮추면 배경이 가라앉으면서
                   위치 핀의 빨강은 알아볼 만큼 남는다.
                   ⚠️ contrast.brightness 를 더하지 말 것 — 도로명과 상호 글자가
                      흐려져 길을 못 읽는다. */
                className="block h-[320px] w-full border-0 saturate-50 sm:h-[400px] lg:aspect-[3/1] lg:h-auto"
              />
            </Reveal>

            {/* Section 컴포넌트를 쓰지 않는다. 생김새만 Section 의 제목
                블록과 맞춘다.

                근거가 둘이다. 하나는 Section 이 제목을 항상 children 위에
                놓는데 여기는 **지도가 제목보다 먼저** 와야 한다는 것이고
                (그래서 지도를 Section 밖에 둘 수가 없다), 다른 하나는
                Section 이 py-16 sm:py-24 를 제 몫으로 갖는다는 것이다 —
                여기는 바깥 div 가 이미 py-14 sm:py-20 을 쓰고 gap-10 으로
                둘을 띄운다. 갈아타면 세로가 한 번 더 붙는다. 간격을 이
                페이지가 직접 쥐고 있다.

                제목은 "연락처" 다. "오시는 길" 로 하면 바로 위 h1 과 같은
                말을 두 번 하게 된다.

                ⚠️ delay={90} 이다 — 위 지도(0)보다 늦게 떠야 한다. */}
            <Reveal delay={90}>
              <p className="text-xs font-bold tracking-[0.08em] text-brand">
                CONTACT
              </p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-ink sm:text-4xl">
                연락처
              </h2>
              {/* ⚠️ 제목 아래 안내 한 줄을 두지 않는다. 참고한
                     webprosoft.kr "찾아오시는길" 짜임을 따라 "방문에 필요한
                     연락처와 찾아오시는 길을 안내해 드립니다" 를 넣었던
                     적이 있는데, 위 배너가 이미 "샘플을 들고 오시면 현장에서
                     함께 검토합니다. 방문 전 연락 바랍니다." 를 말하고 있어
                     한 화면에서 두 번 안내하는 꼴이었다. 아래 목록이
                     무엇인지는 "연락처" 라는 제목으로 충분하다. */}

              {/* 연락처 목록.

                  ⚠️ 테두리 상자와 회색 라벨 칸을 걷은 자리다. 한때 제품 상세
                     사양 표와 같은 꼴(바깥 테두리 + bg-surface 라벨 칸 +
                     칸 사이 선)이었는데, 값이 여섯뿐인 자리에 표의 틀까지
                     두니 무거웠다. 히어로 "주요 사양" 카드도 같은 이유로
                     표에서 박스로 바뀐 적이 있다.

                  ⚠️ **이 표가 사이트의 기준 디자인이 됐다.** 제품 상세 사양
                     표(구동 · 옵션)와 회사 개요 표를 여기에 맞춰 통일해
                     달라는 요청에, 그 둘이 아래 className 을 그대로 가져갔다.
                     여기를 고치면 그 둘도 같이 본다 —
                       src/app/products/[slug]/page.tsx  (SPECIFICATIONS)
                       src/app/company/page.tsx          (OVERVIEW)
                     한때 "제품 상세는 값이 21개라 격자가 맞고 여기는 목록이
                     맞다" 고 적어 두었는데, 그 표는 지금 값이 14개(2 x 7제품)
                     이고 디자인도 이쪽으로 왔다.

                  라벨은 13px 회색, 값은 15px 먹색이다. 굵기가 아니라 크기와
                  색으로 가른다 — 둘 다 굵게 하면 어디부터 값인지 흐려진다.

                  lg 부터 2열이다. 행 우선(grid-flow-row 기본)이라 선이
                  행마다 가로로 이어진다. 열 우선으로 돌리면 왼쪽 열 셋이
                  먼저 차면서 선이 열마다 끊겨 표처럼 보인다 — 표를 걷으려고
                  고친 자리에서 다시 표가 된다.

                  dl/dt/dd 는 그대로다. 라벨-값은 용어-정의가 맞고, 접근성
                  검사(dlitem)가 dt.dd 를 dl 직계로 요구한다. 생김새만 바뀐다. */}
              <dl className="mt-8 grid border-t border-line lg:grid-cols-2 lg:gap-x-12">
                {cells.map((cell) => (
                  <div
                    key={cell.label}
                    /* ⚠️ items-center 다. 이 dl 이 lg:grid-cols-2 라 같은
                       격자 행의 두 칸이 높이를 나눠 갖는데, flex 의 기본값
                       stretch 가 dt.dd 를 그 높이만큼 늘리고 글자는 맨 위에
                       붙는다. 1440 에서 "주차" 는 값이 한 줄인데도 옆
                       "운영 시간"(두 줄) 때문에 행이 86px 라, 그 꼭대기에
                       떠 있었다. 가운데로 두면 한 줄 값이 31px(=86/2-12)에
                       선다.

                       같은 이유로 dt 의 pt-0.5 를 걷었다. 글을 살짝 내려
                       값 첫 줄에 맞추던 값인데, 가운데 정렬에서는 그만큼
                       아래로 밀린다. */
                    className="flex items-center gap-4 border-b border-line py-4"
                  >
                    <dt className="w-16 shrink-0 text-13 font-bold text-muted sm:w-20">
                      {cell.label}
                    </dt>
                    <dd className="text-15 leading-relaxed text-ink">
                      {cell.body}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </Container>
      </div>

      <ContactCTA />
    </>
  );
}
