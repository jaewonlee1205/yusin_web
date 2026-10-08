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
  /* 연락처 여섯 칸. lg 2열에서 행 우선으로 흐르고, wide 인 둘은 전폭이다 —

       전화 | 팩스
       이메일 | 주차
       주소      (전폭)
       운영 시간 (전폭)

     ⚠️⚠️ **2열 행이 먼저, 전폭 행이 나중이다.** 한때 주소가 맨 위였는데
           (지도에서 눈을 뗀 다음 처음 찾는 값이라는 이유였다), 그러면
           리듬이 **1 - 2 - 2 - 1** 로 되돌아와 "1줄 2줄이 섞여 이상하다" 는
           말을 들었다. 지금은 **2 - 2 - 1 - 1** 로 한 방향으로 흐른다.
           배치 리듬이 값 하나의 순서보다 먼저다 — 주소는 전폭이라 어디에
           있든 눈에 띈다.

     ⚠️⚠️ **주소가 wide 인 까닭.** 2열 칸에서는 한 줄에 436px 가 필요한데
           391px 밖에 없어 늘 2줄이었다(1440 실측). 표가 1줄로 정렬되는 쪽이
           보기 좋다는 요청에 전폭으로 뺐다 — 전폭이면 1088px 라 넉넉하다.
           주소를 깎아 줄이는 길도 있었지만 호수가 둘(A동 201호, 323~324호)
           이라 정보가 사라진다.

     ⚠️⚠️ **운영 시간도 wide 여야 한다.** 전폭을 하나만 쓰면 2열에 남는 칸이
           다섯(홀수)이 되고, 마지막 행에 칸이 **하나만** 서서 그 행의 선이
           왼쪽 절반에서 끊긴다 — 계단처럼 보인다. 전폭 둘 + 2열 넷이면
           네 행이 모두 꽉 찬다.

           ⚠️ 그래서 칸을 더하거나 뺄 때 **wide 가 아닌 칸의 수가 짝수**여야
              한다. 아래 dl 의 border-b 선택자도 "마지막 칸이 전폭" 을
              전제한다.

     ⚠️ 주소가 맨 위인 것은 바로 위가 지도여서다 — 지도에서 눈을 떼고 처음
        찾는 값이 주소다. 한때 전화가 먼저였는데, 그때는 주소가 2열 오른쪽
        칸이라 같은 행에서 나란히 보였다.

     "언제 가면 되나"(운영 시간)가 맨 끝인 이유: 어디로.어떻게를 먼저 읽고
     그것이 뒤따르는 순서가 자연스럽다. */
  const cells: { label: string; body: ReactNode; wide?: boolean }[] = [
    {
      label: "전화",
      /* ⚠️⚠️ **대표번호 하나만 그린다.** 한때 아래에 추가 회선 둘
               (site.telExtra — 031-434-7241~2 · 031-318-0052)을 muted 로
               한 줄 더 쌓았는데, 그 줄 때문에 이 칸이 **2줄**이 되어 표의
               행 높이가 갈렸다. 표가 1줄로 정렬되는 쪽이 보기 좋다는
               요청에 뺐다.

               ⚠️ site.telExtra 데이터는 **지우지 말 것.** 홈 page.tsx 의
                  JSON-LD 가 telephone: [site.tel, ...site.telExtra] 로
                  검색엔진에 넘긴다 — 화면에서만 빠졌지 사이트가 가진
                  번호가 줄어든 것이 아니다.

               ⚠️ 되살린다면 행 높이가 다시 갈린다는 것을 알고 할 것.
                  (주소도 1440 에서 2줄이라, 지금은 여섯 행 중 주소만
                  2줄이다.) */
      body: (
        <a
          href={telHref(site.tel)}
          className="block tabular-nums text-ink-soft transition-colors hover:text-brand"
        >
          {site.tel}
        </a>
      ),
    },
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
    /* 이름은 road 지만 담긴 값은 지번이다 — 호수 표기가 확인되면 도로명으로
       바꾼다(site.ts TODO 1). 건물명(동우디지털파크)과 호수가 그 안에 이미
       들어 있어 이 칸 하나로 충분하다. */
    { label: "주소", body: site.address.road, wide: true },
    {
      label: "운영 시간",
      /* CTA와 푸터에도 같은 값이 나오지만 그 둘은 모든 페이지에 깔리는 사이트
         크롬이고, 여기서는 방문 시간이다.

         한때 이 아래 "길찾기 | 네이버 지도 · 카카오맵" 칸이 하나 더 있었다.
         표의 다른 칸은 모두 값인데 거기만 나가는 링크 둘이라 결이 달랐다.
         지도앱으로 가는 길은 푸터에 남아 있다.

         ⚠️⚠️ **한 줄이다.** 한때 weekday 와 holiday 를 block 둘로 쌓아
               2줄이었는데, 위 전화와 같은 이유로(표를 1줄로 정렬) 한 줄에
               넣었다. 휴무는 괄호에 담고 muted 로 한 단계 낮춘다 — 색
               구분은 쌓여 있을 때와 같다.

               ⚠️ 괄호를 쓰는 까닭: 가운뎃점으로 이으면 값 안의 "토·일요일" 과
                  섞여 어디가 경계인지 흐려진다.

               ⚠️⚠️ **site.ts 의 hours 를 합치지 말 것.** 그 두 값은 세 화면이
                     먹는다 — /location · ContactCTA · Footer. 데이터를 합치면
                     나머지 둘이 함께 바뀐다. 합치는 일은 **여기 화면에서만**
                     한다.

               한 줄 폭은 약 281px 다(두 값 269px + 괄호). 1440 의 오른쪽 칸은
               주소가 391px 까지 쓰므로 들어가고, 1024(327px)도 들어간다.
               390 에서는 dd 가 228px 라 다시 2줄이 된다 — 모바일은 어쩔 수 없다. */
      body: (
        <>
          <span className="tabular-nums">{site.hours.weekday}</span>
          <span className="text-muted"> ({site.hours.holiday})</span>
        </>
      ),
      /* 전폭이다 — 위 배열 주석의 "운영 시간도 wide 여야 한다" 참고.
         값이 넘쳐서가 아니라 **마지막 행을 꽉 채우기 위해서**다. */
      wide: true,
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
          {/* 제목 → **지도와 연락처가 한 카드**로 눕는다. 전폭 1열이다.

              배치를 **다섯 번** 바꿨다.

                1) 지도가 위   — 1088x462 라 1440 에서 바닥이 863px 였고,
                                 전화번호를 보려면 반드시 한 번 굴려야 했다
                2) 2열         — 지도 약 620px + 오른쪽 연락처
                3) 연락처가 위 — 다시 전폭 1열. 그 스크롤 문제가 사라졌다
                4) 지도가 위   — 요청이다. 제목도 지도 위로 올렸다
                5) **한 카드** — 지금. 지도와 표를 한 테두리 안에 넣었다

              ⚠️ 5번의 이유. 4번에서 "지도 바로 밑에 표가 오는 게 부자연스럽다"
                 는 말을 들었다. 원인은 **순서가 아니라 재질**이었다 — 지도는
                 사방 테두리 + rounded-2xl 인 **카드**인데 표는 선만 있는
                 **평평한 목록**이라, 카드 밑변이 끝난 40px 뒤에 성격이 다른
                 블록이 시작했다. 한 테두리로 묶으면 "붙어 있는 둘" 이 아니라
                 **한 덩어리**가 된다.

              ⚠️⚠️ 1번의 스크롤 문제로 **되돌아간 것이 아니다.** 그때와 다른
                    점이 셋이다 — 지도를 3:1 로 눕혀 462 -> 364px 가 됐고,
                    표를 2열 x 3행으로 접어 382 -> 230px 가 됐고, 이번에
                    지도.표 사이 gap-10(40px)이 **카드 안의 선 1px** 로 줄었다.

                    위 압축은 절대 되돌리지 말 것 — 지도를 다시 세우거나,
                    표를 1열로 펴거나, 카드를 다시 쪼개면 1번으로 돌아간다.

              ⚠️ 1440 실측(변경 전 -> 후) —
                   표 첫 줄의 화면 좌표   940 -> 900px
                   카드(지도+표) 바닥    1169 -> 1129px
                   페이지 전체           1892 -> 1852px
                 900px 뷰포트에서 연락처 첫 줄이 **경계에 닿는다.** 세로를
                 40px 만 더 써도 다시 첫 화면 밖으로 나간다. */}
          <div className="flex flex-col gap-10">
            {/* Section 컴포넌트를 쓰지 않는다. 생김새만 Section 의 제목
                블록과 맞춘다.

                ⚠️ 한때 **지도가 제목보다 먼저** 왔고, 그것이 Section 을 쓰지
                   못하는 첫째 근거였다(Section 은 제목을 늘 children 위에
                   놓는다). 지금은 제목 → 카드 순이라 그 근거는 사라졌다.
                   그래도 Section 으로 갈아타지 않는 **둘째 근거는 그대로**다 —
                   Section 이 py-16 sm:py-24 를 제 몫으로 갖는데 여기는 바깥
                   div 가 이미 py-14 sm:py-20 을 쓰고 gap-10 으로 둘을 띄운다.
                   갈아타면 세로가 한 번 더 붙는다. 간격을 이 페이지가 직접
                   쥐고 있다.

                제목이 "위치 및 연락처" 다. 한때 "연락처" 였는데, 그때는 이
                블록이 지도 **아래**에 있어 표만 덮으면 됐다. 지금은 제목이
                지도와 표를 **한 카드로** 덮으므로 "연락처" 로는 반쪽만
                말한다. "오시는 길" 은 쓸 수 없다 — 바로 위 h1 이 그 말이다.

                ⚠️ delay 가 없다(0). 아래 카드(90)보다 먼저 떠야 한다. */}
            <Reveal>
              <p className="text-xs font-bold tracking-[0.08em] text-brand">
                FIND US
              </p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-ink sm:text-4xl">
                위치 및 연락처
              </h2>
            </Reveal>

            {/* ⚠️⚠️ **지도와 연락처가 한 Reveal(한 카드) 안에 있다.** 한때
                      Reveal 이 셋(제목 0 · 지도 90 · 표 150)이었는데, 한
                      덩어리의 일부가 따로 올라오면 묶은 뜻이 사라진다.
                      지금은 둘이다 — 제목(0) · 카드(90).

                ⚠️ 카드가 bg-white 다. 안쪽 지도 칸만 bg-surface 다(아래).

                테두리로 선다(2D). 그림자로 띄우면 자료를 읽는 자리에 맞지
                않는다 — 사이트의 다른 표(제품 사양 · 회사 개요)도 전부
                선뿐이다. */}
            <Reveal
              delay={90}
              className="overflow-hidden rounded-2xl border border-line bg-white"
            >
              {/* lg 부터 3:1 이다(1088x363) — 홈 PERFORMANCE 영상과 같은
                  비율로 가로로 시원하게 눕는다. 한때 칸 높이를 받는 lg:flex +
                  lg:min-h-[25rem] 였는데, 그건 오른쪽에 연락처가 있어 행
                  높이를 그쪽이 정하던 2열 배치에서 쓰던 방식이다.

                  lg 미만은 고정 높이다 — 좁은 폭에서 3:1 로 두면 지도가 너무
                  납작해져 길이 안 보인다.

                  ⚠️⚠️ **relative 와 bg-surface 가 이 div 에 있다.** 한때 둘이
                        Reveal(카드)에 있었는데, 카드가 표까지 감싸게 되면서
                        아래 플레이스홀더의 absolute inset-0 과 길찾기 링크의
                        absolute right-3 top-3 가 **표까지 포함한 카드 전체**를
                        기준으로 잡히게 됐다. 지도 칸이 기준이어야 한다.

                  ⚠️ bg-surface 는 플레이스홀더의 바탕이다. iframe 이
                     loading="lazy" 라 화면에 가까워져야 받기 시작하는데,
                     그동안 **빈 칸**이 떴다 — 320~400px 짜리 흰 구멍이다. */}
              <div className="relative bg-surface">
                <div
                  aria-hidden="true"
                  /* ⚠️ text-ink-soft 다. text-muted(#6b7280)를 이 바탕
                     (bg-surface #f6f7f9)에 올리면 실측 **4.03:1** 로 WCAG
                     AA(4.5:1)에 못 미친다 — 픽셀 히스토그램으로 쟀다.
                     ink-soft(#414751)는 약 8.9:1 이다. */
                  className="absolute inset-0 flex items-center justify-center text-13 text-ink-soft"
                >
                  지도를 불러오는 중…
                </div>
                {/* ⚠️⚠️ 길찾기가 **지도 밖에** 있어야 한다. 이 페이지는
                       "샘플을 들고 오시면 현장에서 함께 검토합니다" 라고
                       해 놓고 가는 법을 주지 않았다. 게다가 키보드로는
                       390px 에서 **Tab 네 번째**에 지도 iframe 이 걸리고,
                       그 안에서 여섯 번을 더 눌러야 아래 연락처로 내려간다
                       — 재서 확인했다. 이 링크가 그 우회로다.

                    ⚠️ z-10 이 필요하다. 위 플레이스홀더와 아래 iframe 사이에
                       끼어 있어 그냥 두면 iframe 이 덮는다. */}
                <a
                  href={site.naverPlace}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute right-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-lg bg-white/95 px-3 py-2 text-13 font-semibold text-ink shadow-card backdrop-blur transition hover:text-brand active:scale-95"
                >
                  길찾기
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
                    className="shrink-0"
                  >
                    <path d="M7 17 17 7" />
                    <path d="M8 7h9v9" />
                  </svg>
                  <span className="sr-only">네이버 지도에서 열기 (새 창)</span>
                </a>

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
                  className="relative block h-[320px] w-full border-0 bg-white saturate-50 sm:h-[400px] lg:aspect-[3/1] lg:h-auto"
                />
              </div>

              {/* 연락처 목록. **지도와 같은 카드 안**이다.

                  ⚠️ 테두리 상자와 회색 라벨 칸을 걷은 자리다. 한때 제품 상세
                     사양 표와 같은 꼴(바깥 테두리 + bg-surface 라벨 칸 +
                     칸 사이 선)이었는데, 값이 여섯뿐인 자리에 표의 틀까지
                     두니 무거웠다. 히어로 "주요 사양" 카드도 같은 이유로
                     표에서 박스로 바뀐 적이 있다. **지금 바깥 테두리는 이
                     표의 것이 아니라 지도와 공유하는 카드의 것이다.**

                  ⚠️ border-t 가 **지도와 표를 가르는 선**이다. 한때 이 선이
                     표의 머리였는데, 카드 안으로 들어오면서 둘 사이의
                     구분선을 겸한다. 걷으면 지도 아래가 그대로 글로 이어진다.

                  ⚠️⚠️ **마지막 칸의 border-b 를 끈다**([&>*:last-child]).
                        카드 바닥 테두리와 1px 간격으로 겹쳐 2중 선이 됐다.

                        ⚠️ **마지막 칸이 전폭(wide)이라 이 하나로 끝난다.**
                           한때 lg:[&>*:nth-last-child(2)] 가 함께 있었다 —
                           2열에서 마지막 행이 두 칸이던 때다. 지금은 운영
                           시간이 전폭이라 그 칸 하나가 곧 마지막 행이다.

                           ⚠️ 마지막 칸을 전폭이 아닌 것으로 바꾸면 이
                              선택자를 다시 짜야 한다(2열에서 마지막 행의
                              **두** 칸을 꺼야 한다).

                  ⚠️⚠️ **좌우 패딩이 dl 이 아니라 행에 있다**(px-5 sm:px-7).
                        행에 주면 border-b 가 패딩까지 덮어 **선이 카드
                        전폭**으로 남는다. dl 에 주면 선이 좌우로 끊겨 카드
                        안에 떠 보인다 — 제품 상세 사양표의 "첫 열만 pl-0" 과
                        같은 발상이다.

                  ⚠️ 그래서 lg:gap-x-12(48px)를 **걷었다.** 행 패딩 28 x 2 가
                     그 일을 대신해 2열 가운데 틈이 56px 다(전에는 48px).
                     게다가 gap 이 0 이라 왼쪽.오른쪽 칸의 border-b 가 맞닿아
                     **선이 가운데에서 끊기지 않는다** — 전에는 48px 틈에서
                     잘려 있었다.

                  ⚠️ **이 표가 사이트의 기준 디자인이다.** 제품 상세 사양 표
                     (구동 · 옵션)와 회사 개요 표가 같은 꼴을 가져갔다 —
                       src/app/products/[slug]/page.tsx  (SPECIFICATIONS)
                       src/app/company/page.tsx          (OVERVIEW)
                     **그 둘은 그대로 둔다.** 조건이 다르다 — 그쪽은 카드
                     **밖**이라 마지막 행의 border-b 가 표의 꼬리를 맺는
                     유일한 선이고, 여기는 카드 **안**이라 카드 바닥 테두리가
                     그 일을 한다. 바뀐 것은 담는 그릇뿐이고 **글자 크기 ·
                     색 · 라벨 폭 · 행 높이는 셋이 그대로 같다.**

                  라벨은 13px 회색, 값은 15px 먹색이다. 굵기가 아니라 크기와
                  색으로 가른다 — 둘 다 굵게 하면 어디부터 값인지 흐려진다.

                  lg 부터 2열이다. 행 우선(grid-flow-row 기본)이라 선이
                  행마다 가로로 이어진다. 열 우선으로 돌리면 왼쪽 열 셋이
                  먼저 차면서 선이 열마다 끊겨 표처럼 보인다.

                  dl/dt/dd 는 그대로다. 라벨-값은 용어-정의가 맞고, 접근성
                  검사(dlitem)가 dt.dd 를 dl 직계로 요구한다. */}
              <dl className="grid border-t border-line [&>*:last-child]:border-b-0 lg:grid-cols-2">
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
                       아래로 밀린다.

                       ⚠️ px-5 sm:px-7 이 **행에** 있다(위 dl 주석 참고).
                          dl 로 옮기면 선이 카드 전폭을 잃는다. */
                    className={`flex items-center gap-4 border-b border-line px-5 py-4 sm:px-7 ${
                      cell.wide ? "lg:col-span-2" : ""
                    }`}
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
