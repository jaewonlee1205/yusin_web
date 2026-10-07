import type { Metadata } from "next";
import type { ReactNode } from "react";
import ContactCTA from "@/components/ContactCTA";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import { NaverIcon } from "@/components/icons";
import { site, telHref } from "@/data/site";

export const metadata: Metadata = {
  title: "오시는 길",
  description: `${site.name} 위치 안내. ${site.address.road}`,
};

const query = encodeURIComponent(site.address.jibun);

/**
 * 지도는 API 키가 필요 없는 구글 지도 embed를 쓴다.
 * 네이버·카카오 지도는 정식 연동에 키가 필요해 검색 링크로 대신한다.
 *
 * TODO: 도로명 주소가 확정되면 site.address 를 고치고 지도 위치를 확인할 것.
 */
const MAP_SRC = `https://maps.google.com/maps?q=${query}&z=16&hl=ko&output=embed`;

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
 * ⚠️ 대중교통 칸도 일부러 넣지 않았다. 노선이 자료마다 엇갈려(1광명.25.8856
 *    <-> 20-1.11-A.11-B) 확인 없이 적으면 방문객이 헤맨다. README 자료 요청
 *    표 16번에 적어 뒀다.
 *
 * ⚠️ 라벨 칸이 좁다. dt 가 w-16(64px), sm 부터 w-20(80px) 이다 — 13px bold
 *    로 "운영 시간" 이 63px 라 sm 부터 한 줄이고 그 아래에서는 두 줄이 된다.
 *    "사업자등록번호"(84px)는 어디서도 안 들어간다. 라벨을 바꿀 때 이 80px 를
 *    넘기지 말 것. 아래 대중교통 블록의 라벨도 같은 폭을 쓴다.
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
          {/* 지도가 전폭으로 눕고 연락처가 그 아래 선다.

              정렬을 두 번 바꿨다. 처음엔 이 꼴이었는데 지도가 1088x462 라
              1440 화면에서 바닥이 863px 였고, 전화번호를 보려면 반드시 한 번
              굴려야 했다. 그래서 2열(지도 약 620px + 연락처)로 좁혔다.

              다시 전폭으로 돌아오면서 세로를 두 군데서 줄여 그 문제를 덜었다
              — 지도를 3:1 로 눕혀 478 -> 363px, 표를 2열 x 3행으로 접어
              382 -> 207px. 지도를 크게 보이려면 이만큼이 한계다.

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
                위아래로 선 둘의 결이 갈린다. */}
            <Reveal className="overflow-hidden rounded-2xl border border-line">
              <iframe
                src={MAP_SRC}
                title={`${site.name} 위치 지도`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block h-[320px] w-full border-0 sm:h-[400px] lg:aspect-[3/1] lg:h-auto"
              />
            </Reveal>

            {/* Section 컴포넌트를 쓰지 않는다. 그쪽은 제목을 항상 맨 위에
                놓는데, 오시는 길에 온 사람은 위치부터 보므로 지도가 먼저
                와야 한다. 생김새만 Section 의 제목 블록과 맞춘다.

                제목은 "연락처" 다. "오시는 길" 로 하면 바로 위 h1 과 같은
                말을 두 번 하게 된다. */}
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
                     두니 무거웠다. 제품 상세는 값이 21개라 격자가 맞고
                     여기는 목록이 맞다 — 히어로 "주요 사양" 카드가 같은
                     이유로 표에서 박스로 바뀐 적이 있다.

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
                    <dt className="w-16 shrink-0 text-[13px] font-bold text-muted sm:w-20">
                      {cell.label}
                    </dt>
                    <dd className="text-[15px] leading-relaxed text-ink">
                      {cell.body}
                    </dd>
                  </div>
                ))}
              </dl>

              {/* 대중교통.

                  ⚠️⚠️ 역 이름만 적는다. 노선 번호도, 건물 앞 정류장 이름도,
                        도보 시간도 적지 않는다 — 확인된 값이 없다.
                        노선은 자료마다 갈리고(1광명.25.8856 <-> 20-1.11-A.
                        11-B), 정류장 이름은 부동산 사이트 한 곳이 "서진클러치
                        230m · 대덕전자 321m" 라 적었을 뿐 한글 표기를 확인할
                        다른 출처가 없다. 틀린 것을 적으면 방문객이 헤맨다.

                        정왕역만 확실하다 — 시화공단을 지나는 시내버스
                        (20-1 · 11-A · 28-29)가 모두 거기서 출발한다.
                        README 자료 요청 16번에 받을 것을 적어 뒀다.

                  그래서 나머지 몫은 길찾기 버튼이 한다. 지도앱이 실시간
                  경로를 붙여 주므로 우리가 적는 어떤 안내보다 정확하다.

                  ⚠️ 한때 이 링크가 위 표의 한 "행" 이었다. 표의 다른 행은 모두
                     값인데 거기만 나가는 링크라 결이 달랐다. 지금은 표 밖의
                     별도 블록이라 그 문제가 없다.

                  카카오맵은 넣지 않는다 — 정식 연동에 키가 필요하고, 검색
                  링크로 대신하면 네이버 쪽과 정확도가 갈린다. */}
              <div className="mt-10 flex flex-col gap-5 rounded-2xl bg-surface p-6 sm:flex-row sm:items-center sm:justify-between">
                {/* 위 연락처 행과 같은 이유로 items-center 다 — 값이 두 줄
                    이라 그냥 두면 라벨이 위에 붙는다. */}
                <div className="flex items-center gap-4">
                  <p className="w-16 shrink-0 text-[13px] font-bold text-muted sm:w-20">
                    대중교통
                  </p>
                  <p className="text-[15px] leading-relaxed text-ink">
                    수인 · 분당선 정왕역
                    <span className="mt-1 block text-[13px] text-muted">
                      역에서 시화공단 방면 시내버스 환승
                    </span>
                  </p>
                </div>
                <a
                  href={site.naverPlace}
                  target="_blank"
                  rel="noopener noreferrer"
                  /* 테두리로 선다(2D). 한때 shadow-card 였는데, 회색 상자
                     위에 흰 버튼이 그림자로 떠 있어 입체로 읽혔다. 호버도
                     색만 바꾼다 — 떠오르거나 그림자가 짙어지면 2D 로 바꾼
                     뜻이 사라진다.

                     글은 "길찾기" 한 낱말이다. "네이버 지도로 길찾기" 는
                     189px 였는데 104px 로 준다 — 어디로 가는지는 왼쪽의 녹색
                     N 아이콘이 말한다. 끝에 있던 화살표도 뺐다. 아이콘이
                     왼쪽에 서면 글자를 기호 둘이 앞뒤로 감싸 번잡하다. */
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-line bg-white px-5 py-3 text-sm font-bold text-ink transition-colors hover:border-ink/20 hover:text-brand"
                >
                  <NaverIcon className="shrink-0 text-[#03C75A]" />
                  길찾기
                </a>
              </div>
            </Reveal>
          </div>
        </Container>
      </div>

      <ContactCTA />
    </>
  );
}
